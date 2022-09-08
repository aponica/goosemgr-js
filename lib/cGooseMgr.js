"use strict";
//=============================================================================
//  Copyright 2019-2022 Opplaud LLC and other contributors. MIT licensed.
//=============================================================================

//-----------
//  @ignore
//-----------

const kFs = require( 'fs' );

//-----------------------------------------------------------------------------
//  @public
//
//  @alias module:@aponica/goosemgr-js.cGooseMgr
//
//  @classdesc
//    Abstract interface to a relational or object database.
//
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
//-----------------------------------------------------------------------------

class cGooseMgr {

  #iConnection = null;
  #hModels = {};

  #hDefinitions = null
  #cGoose = null;
  #iGoose = null;

  //---------------------------------------------------------------------------
  //  @protected
  //
  //  @summary
  //    Constructs a cGooseMgr object.
  //
  //    This is invoked as the `super()` function within a derived class.
  //
  //  @param {Object|string} vDefinitions
  //    The definitions hash (dictionary object) used to create schemas
  //    for the database.
  //
  //    If vDefinitions is a string, it is assumed to be the filename from
  //    which the hash can be read as JSON data.
  //
  //    The hash contains one property for each table or collection to
  //    be accessed. The name of the property is the name of the table or
  //    collection, and its value is whatever is expected by the `Schema`
  //    class of the corresponding "Goose"
  //    ([Mongoose](https://mongoosejs.com)) or
  //    [Mysqlgoose](https://aponica.com/docs/mysqlgoose-js/)).
  //
  //    The hash may contain a property named `"//"` with any value;
  //    it is assumed to be a comment member, and is ignored.
  //
  //  @param {Class} cGoose
  //    The class of the "Goose" being managed. This is typically hardcoded
  //    in the derived class constructor.
  //---------------------------------------------------------------------------

  constructor( vDefinitions, cGoose ) {

    if ( "string" === typeof( vDefinitions ) )
      vDefinitions = JSON.parse( kFs.readFileSync( vDefinitions, 'utf8' ) );

    this.#hDefinitions = vDefinitions;
    this.#cGoose = cGoose;
    this.#iGoose = new cGoose();
    }

  //---------------------------------------------------------------------------
  //  @protected
  //
  //  @summary
  //    Private interface to connect to a database.
  //
  //  @description
  //    Used by {@linkcode
  //      module:@aponica/goosemgr-js.cGooseMgr#fiConnect|cGooseMgr.fiConnect}
  //    to establish a connection.
  //
  //    This method **must** be overridden by a derived class!
  //
  //  @param {*} vConfig
  //    The configuration information as expected by the Goose's method for
  //    establishing a connection, typically containing such information as
  //    the host, database, username and password.
  //
  //  @returns {Promise<*>}
  //    A promise to return a connection to the database. Note that this is
  //    not defined as an `async` function so {@linkcode
  //      module:@aponica/goosemgr-js.cGooseMgr#fpConnect|xGooseMgr.fpConnect}
  //    can be called from outside of an `async` function.
  //
  //  @rejects {Error}
  //---------------------------------------------------------------------------

  fpvCreateConnection( vConfig ) {

    return new Promise(
      ( fDone, fErr ) =>
        fErr( new Error(
          'cGooseMgr.fpvCreateConnection() must be overridden!' ) )
      ); // Promise()

    } // fpvCreateConnection


  //---------------------------------------------------------------------------
  //  @public
  //
  //  @summary
  //    Public interface to connect to a database.
  //
  //  @description
  //    Establishes the connection to the database and creates the models
  //    used to access it.
  //
  //  @param {*} vConfig
  //    The configuration parameters as expected by the Goose's method for
  //    establishing a connection, typically containing such information as
  //    the host, database, username and password.
  //
  //  @returns {Promise}
  //    A promise to connect to the database. Note that this is not defined
  //    as an `async` function so it can be called from the top level of a
  //    program (outside of another `async` function); however, it **can**
  //    be invoked with the `await` syntax.
  //
  //  @rejects {Error}
  //---------------------------------------------------------------------------

  fpConnect( vConfig ) {
    return new Promise( ( fResolve, fReject ) =>
      this.fpvCreateConnection( vConfig ).then( // connection promised
        iConnection => {
          this.#iConnection = iConnection;
          for ( let [ zModel, hDef ] of Object.entries( this.#hDefinitions ) )
            if ( '//' !== zModel )
              this.#hModels[ zModel ] = this.#iConnection.model(
                zModel, new this.#cGoose.Schema(hDef) );
          fResolve();
          },
        iErr => fReject( iErr )
        ) // connection promised
      ); // Promise()
    } // fpConnect()


  //---------------------------------------------------------------------------
  //  @public
  //
  //  @summary
  //    Retrieves the managed "Goose."
  //
  //  @returns {Object}
  //    The "Goose" instance being managed by this GooseMgr.
  //---------------------------------------------------------------------------

  fiGoose() {
    return this.#iGoose;
    }


  //---------------------------------------------------------------------------
  //  @public
  //
  //  @summary
  //    Retrieves a model.
  //
  //  @param {String} zModel
  //    The name of the desired model.
  //
  //  @returns {Object}
  //    The "Model" instance providing the desired access. The actual type
  //    will depend on the type of "Goose."
  //---------------------------------------------------------------------------

  fiModel( zName ) {
    return this.#hModels[ zName ];
    }

  } // cGooseMgr

module.exports = cGooseMgr; // separate for JSDoc!

// EOF
