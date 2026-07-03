const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let isFallbackMode = false;
const dataDir = path.join(__dirname, '../.data');

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    console.warn('⚠️ No MONGODB_URI found in .env. Falling back to Local JSON database.');
    isFallbackMode = true;
    initializeJSONFolder();
    return;
  }

  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ MongoDB Atlas connected successfully.');
  } catch (error) {
    console.error(`⚠️ MongoDB Connection Error: ${error.message}`);
    console.log('⚡ Falling back to Local JSON Database.');
    isFallbackMode = true;
    initializeJSONFolder();
  }
};

function initializeJSONFolder() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log(`📁 Created local database directory at: ${dataDir}`);
  }
}

// Generate unique ID for JSON fallback
function generateId() {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

// Mock Mongoose Query / Instance to simulate Mongoose API
class MockDocument {
  constructor(data, model) {
    Object.assign(this, data);
    Object.defineProperty(this, '_model', { value: model, enumerable: false });
  }

  async save() {
    if (this._id) {
      await this._model.findByIdAndUpdate(this._id, this);
    } else {
      this._id = generateId();
      this.createdAt = new Date().toISOString();
      this.updatedAt = new Date().toISOString();
      const items = this._model._read();
      items.push(JSON.parse(JSON.stringify(this)));
      this._model._write(items);
    }
    return this;
  }
}

// Mock Model simulating Mongoose operations
class MockModel {
  constructor(name) {
    this.name = name;
    this.collectionName = `${name.toLowerCase()}s`;
    this.filePath = path.join(dataDir, `${this.collectionName}.json`);
    this._initializeFile();
  }

  _initializeFile() {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([], null, 2));
    }
  }

  _read() {
    try {
      this._initializeFile();
      return JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
    } catch (e) {
      return [];
    }
  }

  _write(data) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }

  async find(query = {}) {
    let items = this._read();
    return items
      .filter(item => {
        for (let key in query) {
          if (query[key] && typeof query[key] === 'object' && query[key].$ne !== undefined) {
            if (item[key] === query[key].$ne) return false;
          } else if (item[key] !== query[key]) {
            return false;
          }
        }
        return true;
      })
      .map(item => new MockDocument(item, this));
  }

  async findOne(query = {}) {
    const items = await this.find(query);
    return items[0] || null;
  }

  async findById(id) {
    const items = this._read();
    const item = items.find(x => x._id === id || x.id === id);
    return item ? new MockDocument(item, this) : null;
  }

  async create(data) {
    if (Array.isArray(data)) {
      const docs = [];
      for (const item of data) {
        const doc = new MockDocument(item, this);
        docs.push(await doc.save());
      }
      return docs;
    }
    const doc = new MockDocument(data, this);
    return await doc.save();
  }

  async findByIdAndUpdate(id, update, options = { new: true }) {
    const items = this._read();
    const index = items.findIndex(x => x._id === id || x.id === id);
    if (index === -1) return null;
    
    // Support Mongoose $set operator or flat updates
    const current = items[index];
    const updateData = update.$set ? { ...current, ...update.$set } : { ...current, ...update };
    
    updateData.updatedAt = new Date().toISOString();
    items[index] = updateData;
    this._write(items);
    return new MockDocument(updateData, this);
  }

  async findByIdAndDelete(id) {
    const items = this._read();
    const index = items.findIndex(x => x._id === id || x.id === id);
    if (index === -1) return null;
    const deleted = items.splice(index, 1)[0];
    this._write(items);
    return new MockDocument(deleted, this);
  }

  async countDocuments(query = {}) {
    const items = await this.find(query);
    return items.length;
  }

  async deleteMany(query = {}) {
    const items = this._read();
    const remaining = items.filter(item => {
      for (let key in query) {
        if (item[key] === query[key]) return false;
      }
      return true;
    });
    this._write(remaining);
    return { deletedCount: items.length - remaining.length };
  }
}

// Factory function to get either a Mongoose model or a MockModel
function getModel(name, schema) {
  let modelInstance;
  
  // Getter function that resolves dynamically based on fallback mode
  return {
    find: (...args) => isFallbackMode ? new MockModel(name).find(...args) : mongoose.model(name, schema).find(...args),
    findOne: (...args) => isFallbackMode ? new MockModel(name).findOne(...args) : mongoose.model(name, schema).findOne(...args),
    findById: (...args) => isFallbackMode ? new MockModel(name).findById(...args) : mongoose.model(name, schema).findById(...args),
    create: (...args) => isFallbackMode ? new MockModel(name).create(...args) : mongoose.model(name, schema).create(...args),
    findByIdAndUpdate: (...args) => isFallbackMode ? new MockModel(name).findByIdAndUpdate(...args) : mongoose.model(name, schema).findByIdAndUpdate(...args),
    findByIdAndDelete: (...args) => isFallbackMode ? new MockModel(name).findByIdAndDelete(...args) : mongoose.model(name, schema).findByIdAndDelete(...args),
    countDocuments: (...args) => isFallbackMode ? new MockModel(name).countDocuments(...args) : mongoose.model(name, schema).countDocuments(...args),
    deleteMany: (...args) => isFallbackMode ? new MockModel(name).deleteMany(...args) : mongoose.model(name, schema).deleteMany(...args),
    
    // Constructor-like builder for instantiating new documents manually
    new: (data) => {
      if (isFallbackMode) {
        return new MockDocument(data, new MockModel(name));
      } else {
        const MongooseModel = mongoose.model(name, schema);
        return new MongooseModel(data);
      }
    }
  };
}

module.exports = {
  connectDB,
  getModel,
  getIsFallbackMode: () => isFallbackMode
};
