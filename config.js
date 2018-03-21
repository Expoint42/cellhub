class Config {
    constructor() {
        this.SECRET_KEY = process.env.SECRET_KEY || 'hard to guess'
        this.HASH_ALGORITHM = 'sha1'
        this.SALT_ROUNDS = 10
        this.DB_OPTIONS =  { poolSize : 5 } 
        this.DIR_PUBLIC = 'public/'
    }
}

class DevelopmentConfig extends Config {
    constructor() {
        super()
        this.DB_URI = process.env.DEV_MONGO_DB || 'mongodb://test:test@127.0.0.1:1337/cellhub'
    }
}

class TestConfig extends Config {
    constructor() {
        super()
        this.DB_URI = process.env.TEST_MONGO_DB || 'mongodb://test:test@127.0.0.1:1337/cellhub'
    }
}

class ProductionConfig extends Config {
    constructor() {
        super()
        this.DB_URI = process.env.MONGO_DB || 'mongodb://devop:6A2u3cBVksebvpeGg95fPkhMBNaTDC8k@127.0.0.1:1337/cellhub'
    }
}

/**
 * 根据不同运行环境返回配置
 * @param { String } nodeEnv 
 */
module.exports = ( nodeEnv ) => {

    switch (nodeEnv.trim()) {
    case 'development' : return new DevelopmentConfig()
    case 'test': return new TestConfig()
    case 'production': return new ProductionConfig()
    default: return new DevelopmentConfig()
    }
}
