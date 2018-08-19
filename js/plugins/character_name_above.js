// ================================================ =============================
// Tonyryu_PnjName.js
// ================================================ =============================

/ *:
 * @plugindesc Plugin for displaying a name above events (1.00)
 * @author Tonyryu
 *
 * @param Font size
 * @desc Size of the writing font
 * @default 20
 *
 * @param Vertical offset
 * @desc vertical offset
 * @default 0
 * 
 * @param Text Color
 * @desc Text color
 * @default #ffffff
 * 
 *
 * @help http://www.tonyryudev.com/
 * 
 * /

/ *
 * Version tracking 
 * 1.00: 29/10/2015: Tonyryu: Creating plugin
 * 1.01: 29/10/2015: Tonyryu: Adding text color settings
 * 1.02: 28/03/2016: Tonyryu: Added the ability to specify a color by event
 * 
 * /

( function ()  {

  var  parameters  =  PluginManager . parameters ( 'Tonyryu_PnjName' );
  var  param_fontSize  =  Number ( parameters [ 'Font size' ]  ||  20 );
  var  param_verticalOffset  =  Number ( parameters [ 'Vertical offset' ]  ||  0 );
  var  param_textColor  =  String ( parameters [ 'Text Color' ]  ||  '#ffffff' );
  
  
  / ************************************************* *********************
  * ------------------------------------------------- ---------------------
  * Change the "class" Sprite_Character
  * ------------------------------------------------- ---------------------
  ************************************************** ******************** /
  / ************************************************* *********************
  * Method: initialize (overload)
  * Function: 
  * Params: character: Character used for sprite intization
  ************************************************** ******************** /
  var  _Sprite_Character_initialize  =  Sprite_Character . prototype . initialize ;
  Sprite_Character . prototype . initialize  =  function ( character )  {
    _Sprite_Character_initialize . call ( this ,  character );
    this . createPnjName ();
    this . updatePnjName ();
  };
  
  / ************************************************* *********************
  * Method: createPnjName
  * Function: 
  * Params: -
  ************************************************** ******************** /
  Sprite_Character . prototype . createPnjName  =  function ()  {
    if ( this . _character . _pnjName  ! ==  '' ) {
      this . _spritePnjName  =  new  Sprite ();
      this . _spritePnjName . bitmap  =  new  Bitmap ( 180 ,  40 );
      this . _spritePnjName . bitmap . fontSize  =  param_fontSize ;
      this . _spritePnjName . bitmap . textColor  =  this . _character . _pnjNameColor ;
      this . _spritePnjName . bitmap . drawText ( this . _character . _pnjName , 0 , 0 , 180 , 38 , 'center' );
      this . _spritePnjName . x  =  - 90 ;
      this . _spritePnjName . y  =  -  ( param_verticalOffset  +  56  +  param_fontSize );
      this . addChild ( this . _spritePnjName );
    }
  };
  
  / ************************************************* *********************
  * Method: update (overload)
  * Function: 
  * Params: -
  ************************************************** ******************** /
  var  _Sprite_Character_update  =  Sprite_Character . prototype . update ;
  Sprite_Character . prototype . update  =  function ()  {
    _Sprite_Character_update . call ( this );
    this . updatePnjName ();
  };
  
  / ************************************************* *********************
  * Method: updatePnjName (overload)
  * Function: 
  * Params: -
  ************************************************** ******************** /
  Sprite_Character . prototype . updatePnjName  =  function ()  {
    if ( $ gameMap . _events [ this . _character . _eventId ]) {
      if ( this . _spritePnjName ) {
        this . _spritePnjName . visible  =  $ gameMap . _events [ this . _character . _eventId ]. _pnjNameVisible ;
      }
    }
  };
  
  / ************************************************* *********************
  * ------------------------------------------------- ---------------------
  * Modification of the "class" Game_CharacterBase
  * ------------------------------------------------- ---------------------
  ************************************************** ******************** /
  / ************************************************* *********************
  * Method: initMembers (overload)
  * Function: Adds the properties pnjName and pnjNameVisible
  * Params: -
  ************************************************** ******************** /
  var  _Game_CharacterBase_initMembers  =  Game_CharacterBase . prototype . initMembers ;
  Game_CharacterBase . prototype . initMembers  =  function ()  {
    _Game_CharacterBase_initMembers . call ( this );
    this . _pnjName  =  '' ;
    this . _pnjNameVisible  =  true ;
    this . _pnjNameColor  =  param_textColor ;
  };
  
  
  / ************************************************* *********************
  * ------------------------------------------------- ---------------------
  * Modification of the "class" Game_Event
  * ------------------------------------------------- ---------------------
  ************************************************** ******************** /
  / ************************************************* *********************
  * Method: setupPageSettings (overload)
  * Function: Add TonyryuAlchimie command
  * Params: -
  ************************************************** ******************** /
  var  _Game_Event_setupPageSettings  =  Game_Event . prototype . setupPageSettings ;
  Game_Event . prototype . setupPageSettings  =  function ()  {
    _Game_Event_setupPageSettings . call ( this );
    var  regExp  =  /\\NAME/[(.*)\]/ ;
    var  event  =  this . event ();
    var  match  =  regExp . exec ( event . Note );
    if ( match ) {
      if ( match [ 1 ]. indexOf ( ":" )  ===  - 1 )
        this . _pnjName  =  match [ 1 ];
      else {
        var  tabParams  =  match [ 1 ]. split ( ":" );
        this . _pnjName  =  tabParams [ 0 ];
        this . _pnjNameColor  =  tabParams [ 1 ];
      }
    
    }
  };
  
  / ************************************************* *********************
  * Method: pnjNameShow (overload)
  * Function: Make visible the name
  * Params: -
  ************************************************** ******************** /
  Game_Event . prototype . pnjNameShow  =  function ()  {
    this . _pnjNameVisible  =  true ;
  };
  
  / ************************************************* *********************
  * Method: pnjNameHide (overload)
  * Function: Make invisible the name
  * Params: -
  ************************************************** ******************** /
  Game_Event . prototype . pnjNameHide  =  function ()  {
    this . _pnjNameVisible  =  false ;
  };
  
  
  / ************************************************* *********************
  * ------------------------------------------------- ---------------------
  * Modification of the "class" Game_Interpreter
  * ------------------------------------------------- ---------------------
  ************************************************** ******************** /
  / ************************************************* *********************
  * Method: pluginCommand (overload)
  * Function: Add TonyryuAlchimie command
  * Params: command: name of the order
  * args: list of additional parameters
  ************************************************** ******************** /
  var  _Game_Interpreter_pluginCommand  =  Game_Interpreter . prototype . pluginCommand ;
  Game_Interpreter . prototype . pluginCommand  =  function ( command ,  args )  {
    _Game_Interpreter_pluginCommand . call ( this ,  command ,  args );
    var  idEvent  =  this . _eventId ;
    if ( args [ 0 ])
      idEvent  =  Number ( args [ 0 ]);
    
    if ( command  ===  'TonyryuPnjNameShow' )
      $ gameMap . _events [ idEvent ]. pnjNameShow ();
    if ( command  ===  'TonyryuPnjNameHide' )
      $ gameMap . _events [ idEvent ]. pnjNameHide ();
  };

}) ();