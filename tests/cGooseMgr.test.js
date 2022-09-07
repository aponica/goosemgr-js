//=============================================================================
//  Copyright 2022 Opplaud LLC and other contributors. MIT licensed.
//=============================================================================

//-----------------------------------------------------------------------------
//  Unit tests for goosemgr-js cGooseMgr class.
//-----------------------------------------------------------------------------

const kcGooseMgr = require( '../lib/cGooseMgr.js' );

//-----------------------------------------------------------------------------

test( 'ConnectThrowsOverrideMsg', fDone => {

  const iGooseMgr = new kcGooseMgr( {}, class cNoGoose {} );

  iGooseMgr.fiConnect( {} ).then( // promised

    vResult => { // resolved
      expect( vResult ).toEqual( '"to never happen"' );
      fDone();
      },

    iErr => { // rejected
      expect( iErr ).toBeInstanceOf( Error );
      expect( iErr.message ).toEqual(
        'cGooseMgr.fiCreateConnection() must be overridden!'  );
      fDone();
      }

    ); // promised

  } ); // test(ConnectThrowsOverrideMsg)

//-----------------------------------------------------------------------------

test( 'DerivedClassMethods', async () => {

  class cDerivedClass extends kcGooseMgr {
    fiCreateConnection( hConfig ) {
      return new Promise( fDone =>
        fDone( { model: ( zModel, iSchema ) => ({ zModel, iSchema }) } )
        );
      } // fiCreateConnection
    } // cDerivedClass

  class noSchema {
    constructor( hDef ) { this.hDef = hDef; }
    }

  class cNoGoose {}

  cNoGoose.Schema = noSchema;

  try {

    const hTable1 = { foo: 'bar' };

    const hDefs = { '//' : {}, table1: hTable1 };

    const iGooseMgr = new cDerivedClass( hDefs, cNoGoose );

    await iGooseMgr.fiConnect( {} );

    expect( iGooseMgr.fiGoose() ).toBeInstanceOf( cNoGoose );

    const iModel = iGooseMgr.fiModel( 'table1' );

    expect( iModel ).toHaveProperty( 'zModel' );

    expect( iModel.zModel ).toBe( 'table1' );

    expect( iModel ).toHaveProperty( 'iSchema' );

    expect( iModel.iSchema ).toHaveProperty( 'hDef' );

    expect( iModel.iSchema.hDef ).toBe( hTable1 );

    expect( iGooseMgr.fiModel( '//' ) ).toBeUndefined();

    }
  catch ( iErr ) {
    expect( iErr ).toEqual( 'to never happen' );
    }

  } ); // test(DerivedClassMethods)

// EOF
