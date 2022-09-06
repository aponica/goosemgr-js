//=============================================================================
//  Copyright 2019-2022 Opplaud LLC and other contributors. MIT licensed.
//=============================================================================

//-----------------------------------------------------------------------------
//  @module @aponica/goosemgr-js
//  @public
//
//  @summary
//    Abstract interface to a relational or object database.
//
//  @description
//    A Goose Manager provides a consistent way to access an object or
//    relational database.
//
//    It is not used directly, but serves as the base class for
//    [@aponica/goosemgr-mongoose-js](https://aponica.com/docs/goosemgr-mongoose-js/)
//    (to connect to a [MongoDB](https://www.mongodb.com/) database using
//    [MongooseJS](https://mongoosejs.com)) and
//    [@aponica/goosemgr-mysqlgoose-js](https://aponica.com/docs/goosemgr-mysqlgoose-js/)
//    (to connect to a [MySQL](https://www.mysql.com/) database using
//    [@aponica/mysqlgoose-js](https://aponica.com/docs/mysqlgoose-js/)).
//
//  @see https://aponica.com/docs/goosemgr-mongoose-js/
//  @see https://aponica.com/docs/goosemgr-mysqlgoose-js/
//-----------------------------------------------------------------------------

module.exports = require( './lib/cGooseMgr.js' );

// EOF
