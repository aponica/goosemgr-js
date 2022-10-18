//=============================================================================
//  Copyright 2022 Opplaud LLC and other contributors. MIT licensed.
//=============================================================================

//-----------------------------------------------------------------------------
//  Unit tests for goosemgr-js cGooseMgr class.
//-----------------------------------------------------------------------------

const kcGooseMgr = require( '../lib/cGooseMgr.js' );

class cNoGoose {}
cNoGoose.POPULATE = 'POPULATE';

//-----------------------------------------------------------------------------

function fiGooseMgr( vDefinitions ) {

  class cDerivedClass extends kcGooseMgr {
    fpvCreateConnection( vConfig ) {
      return new Promise( fDone =>
        fDone( { model: ( zModel, iSchema ) => ({ zModel, iSchema }) } )
        );
      } // fpCreateConnection
    } // cDerivedClass

  class noSchema {
    constructor( hDef ) { this.hDef = hDef; }
    }

  cNoGoose.Schema = noSchema;

  return new cDerivedClass( vDefinitions, cNoGoose );

} // fiGooseMgr


//-----------------------------------------------------------------------------

test( 'ConnectThrowsOverrideMsg', fDone => {

  const iGooseMgr = new kcGooseMgr( {}, cNoGoose );

  iGooseMgr.fpConnect( {} ).then( // promised

    vResult => { // resolved
      expect( vResult ).toEqual( '"to never happen"' );
      fDone();
      },

    iErr => { // rejected
      expect( iErr ).toBeInstanceOf( Error );
      expect( iErr.message ).toEqual(
        'cGooseMgr.fpvCreateConnection() must be overridden!'  );
      fDone();
      }

    ); // promised

  } ); // test(ConnectThrowsOverrideMsg)

//-----------------------------------------------------------------------------

test( 'DefinitionsFromConfigFile', async () => {

  try {

    const iGooseMgr = fiGooseMgr( 'tests-config/definitions.json' );

    await iGooseMgr.fpConnect( {} );

    const iModel = iGooseMgr.fiModel( 'tableA' );

    expect( iModel ).toHaveProperty( 'zModel' );

    }
  catch ( iErr ) {
    expect( iErr ).toEqual( 'to never happen' );
    }

  } ); // test(DefinitionsFromConfigFile)

//-----------------------------------------------------------------------------

test( 'DerivedClassMethods', async () => {

  try {

    const hTable1 = { foo: 'bar' };

    const hDefs = { '//' : {}, table1: hTable1 };

    const iGooseMgr = new fiGooseMgr( hDefs );

    await iGooseMgr.fpConnect( {} );

    expect( iGooseMgr.fzPopulate() ).toBe( cNoGoose.POPULATE );

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
