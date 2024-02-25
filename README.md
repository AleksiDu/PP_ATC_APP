# PP_ATC_APP

PP_ATC_APP is a program designed to generate Sinumerick measuring G-code with cycles from CATIA aptsource files.

## Features

- Generates Sinumerick measuring G-code with cycles from CATIA aptsource files.
- Supports multi-points probing in Catia machining.
- Requires selection of the Post processor words table IMS.pptable.
- Automatically opens the file location after successful generation.
- Opens the generated file in your default G-code editor.

## Installation

1. Download the executable from the PP_ATC folder.
2. Install the program.
3. Run the program.

## Usage

1. Choose the .aptsource file.
2. Click on "Generate" to create the G-code.
3. After successful generation, the program will automatically open the file location.
4. The generated file will also open in your default G-code editor.

## Code Examples

### aptsource

```
PROBE/POINTS,MMPM, 500.000000,DIST, 30.000000, 5.000000,$
CONTACT, 0.000000,TOL, 0.100000,$
USER_START,TYPE,,GOAL,,INFO,,PARAM,,END_PARAM,$
SPROG,,VAR_IND,,VAR_VAL,,USER_END

GOTO / 635.21944, -75.13133, 19.00000, 0.000000, 0.000000, 1.000000
PROBE/OFF
```

### Sinumerick G-code

```
CYCLE978(0,1,,1,19,100,100,3,2,1,"",,0,1.01,-1.01,,0.34,1,0,,1,0)
```

## Compatibility

For now, the program is available for Sinumerick 840i controllers with custom macros. You can freely edit the source code for your own use.

## Support

## If you encounter any issues or have questions, please contact.
