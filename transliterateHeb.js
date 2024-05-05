// credits to [Stephen P. Morse](mailto:steve@stevemorse.org)
// https://stevemorse.org/hebrew/eng2heb.html

var ALEF = 'א';
var BAIS = 'ב';
var GIMEL = 'ג';
var DALET = 'ד';
var HAY = 'ה'; 
var VAV = 'ו';
var ZAYIN = 'ז';
var KHESS = 'ח';
var TESS = 'ט';
var YUD = 'י';
var KHAF2 = 'ך';
var KAF = 'כ';
var LAMED = 'ל';
var MEM2 = 'ם';
var MEM = 'מ';
var NUN2 = 'ן';
var NUN = 'נ';
var SAMEKH = 'ס';
var AYIN = 'ע';
var FAY2 = 'ף';
var PAY = 'פ';
var TSADI2 = 'ץ';
var TSADI = 'צ';
var KUF = 'ק';
var RAISH = 'ר';
var SHIN = 'ש';
var TAF = 'ת';
var BLANK = ' ';
var GERESH = '׳';

function isAlphaNumeric(c) {
  return (
    (c >= '0' && c <= '9') || (c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z')
  );
}

function AtStart(i, text) {
  return i == 0 || !isAlphaNumeric(text.charAt(i - 1));
}

function AtEnd(i, text) {
  var ch = text.charAt(i).toUpperCase();
  while (i < text.length - 1) {
    var rv = text.charAt(i + 1).toUpperCase();
    if (ch != rv) {
      break;
    }
    i++;
  }
  return i == text.length - 1 || !isAlphaNumeric(text.charAt(i + 1));
}

function PrevChar(i, text) {
  if (i == 0) {
    return '';
  }
  return text.charAt(i - 1).toUpperCase();
}

var nextCharSpan;

function NextChar(i, text) {
  var ch = text.charAt(i).toUpperCase();
  var rv = '';
  nextCharSpan = 0;
  while (i < text.length - 1) {
    nextCharSpan = nextCharSpan - -1;
    rv = text.charAt(++i).toUpperCase();
    if (ch != rv) {
      break;
    }
  }
  return rv;
}

function TrueNextChar(i, text) {
  nextCharSpan = 1;
  if (i >= text.length) {
    return '';
  }
  return text.charAt(i + 1).toUpperCase();
}

var possibilities = 'all'; // values are "one" or "all"
function SetPossibilities(arg) {
  possibilities = arg;
}

function eng_to_hebrew(text) {
  var sephardic = false;
  var ashkenazi = true;
  var yiddish = false;
  var hebrewText = [''];
  for (var i = 0; i < text.length; i++) {
    var englishLetter = text.charAt(i).toUpperCase();
    if (englishLetter == PrevChar(i, text)) {
      continue;
    }
    var hebrewLetter = '';
    if (englishLetter == 'A') {
      if (
        !AtEnd(i, text) &&
        (NextChar(i, text) == 'Y' || NextChar(i, text) == 'I')
      ) {
        if (AtStart(i, text)) {
          hebrewLetter = ALEF + YUD + YUD;
        } else {
          hebrewLetter = YUD + YUD;
        }
        i += nextCharSpan;
      } else if (yiddish) {
        hebrewLetter = ALEF;
      } else if (AtEnd(i, text)) {
        hebrewLetter = HAY;
      } else if (AtStart(i, text)) {
        hebrewLetter = ALEF + '|' + AYIN;
      } else {
        continue;
      }
    } else if (englishLetter == 'B') {
      hebrewLetter = BAIS;
    } else if (englishLetter == 'C') {
      if (!AtEnd(i, text)) {
        if (
          NextChar(i, text) == 'E' ||
          NextChar(i, text) == 'I' ||
          NextChar(i, text) == 'Y'
        ) {
          hebrewLetter = SAMEKH;
          if (!yiddish) {
            hebrewLetter = hebrewLetter + '|' + SHIN;
          }
          i += nextCharSpan;
        } else if (NextChar(i, text) == 'H') {
          i += nextCharSpan;
          if (yiddish) {
            hebrewLetter = KAF + '|' + TESS + SHIN;
          } else if (!AtEnd(i, text) && NextChar(i, text) == 'N') {
            hebrewLetter = TSADI + GERESH + '|' + KAF;
          } else {
            hebrewLetter = TSADI + GERESH + '|' + KAF + '|' + KHESS;
          }
        } else if (NextChar(i, text) == 'Z') {
          // CZ is Polish
          if (yiddish) {
            hebrewLetter = KAF + '|' + TESS + SHIN;
          } else {
            hebrewLetter = TSADI + GERESH;
          }
          i += nextCharSpan;
        } else {
          hebrewLetter = KUF + '|' + KAF;
          if (NextChar(i, text) == 'K') {
            i += nextCharSpan;
          }
        }
      } else {
        hebrewLetter = KUF;
      }
    } else if (englishLetter == 'D') {
      hebrewLetter = DALET;
    } else if (englishLetter == 'E') {
      if (
        !AtEnd(i, text) &&
        (NextChar(i, text) == 'Y' || NextChar(i, text) == 'I')
      ) {
        if (AtStart(i, text)) {
          hebrewLetter = ALEF + YUD + YUD;
        } else {
          hebrewLetter = YUD + YUD + '|' + YUD;
        }
        i += nextCharSpan;
      } else if (!AtEnd(i, text) && NextChar(i, text) == 'U') {
        // it's the OY sound
        hebrewLetter = VAV + YUD + '|' + VAV;
        i += nextCharSpan;
      } else if (AtStart(i, text)) {
        if (yiddish) {
          hebrewLetter = AYIN;
        } else {
          hebrewLetter = ALEF;
        }
      } else if (!AtEnd(i, text) && TrueNextChar(i, text) == 'E') {
        hebrewLetter = YUD + YUD + '|' + YUD;
        i += nextCharSpan;
      } else {
        if (yiddish && !AtEnd(i, text)) {
          hebrewLetter = AYIN;
        } else {
          continue;
        }
      }
    } else if (englishLetter == 'F') {
      hebrewLetter = PAY;
    } else if (englishLetter == 'G') {
      //            hebrewLetter = GIMEL; // what about G like in George???
      if (!AtEnd(i, text)) {
        if (
          NextChar(i, text) == 'E' ||
          NextChar(i, text) == 'I' ||
          NextChar(i, text) == 'Y'
        ) {
          if (yiddish) {
            hebrewLetter = DALET + ZAYIN + '|' + GIMEL;
          } else {
            hebrewLetter = GIMEL + GERESH + '|' + GIMEL;
          }
          i += nextCharSpan;
        } else {
          hebrewLetter = GIMEL;
        }
      } else {
        hebrewLetter = GIMEL;
      }
    } else if (englishLetter == 'H') {
      hebrewLetter = HAY;
    } else if (englishLetter == 'I') {
      if (!AtEnd(i, text) && NextChar(i, text) == 'E') {
        if (AtStart(i, text)) {
          hebrewLetter = ALEF + YUD + YUD;
        } else {
          hebrewLetter = YUD + YUD + '|' + YUD;
        }
        i += nextCharSpan;
      } else {
        /*
              if (yiddish) {
                hebrewLetter = YUD;
              } else {
                hebrewLetter = YUD + "|" + "";
              }
*/
        hebrewLetter = YUD;
      }
    } else if (englishLetter == 'J') {
      if (yiddish) {
        hebrewLetter = DALET + ZAYIN;
      } else {
        hebrewLetter = GIMEL + GERESH;
      }
    } else if (englishLetter == 'K') {
      if (!AtEnd(i, text) && NextChar(i, text) == 'H') {
        i += nextCharSpan;
        if (yiddish) {
          hebrewLetter = KAF;
        } else if (!AtEnd(i, text) && NextChar(i, text) == 'N') {
          hebrewLetter = KAF;
        } else {
          hebrewLetter = KAF + '|' + KHESS;
        }
      } else {
        hebrewLetter = KUF + (!AtEnd(i, text) ? '|' + KAF : '');
      }
    } else if (englishLetter == 'L') {
      hebrewLetter = LAMED;
    } else if (englishLetter == 'M') {
      hebrewLetter = MEM;
    } else if (englishLetter == 'N') {
      hebrewLetter = NUN;
    } else if (englishLetter == 'O') {
      if (AtStart(i, text)) {
        hebrewLetter = ALEF + VAV;
      } else {
        hebrewLetter = VAV;
      }
      if (
        !AtEnd(i, text) &&
        (NextChar(i, text) == 'I' || NextChar(i, text) == 'Y')
      ) {
        hebrewLetter = hebrewLetter + YUD;
        i += nextCharSpan;
      }
      if (!AtEnd(i, text) && NextChar(i, text) == 'U') {
        i += nextCharSpan;
      }
    } else if (englishLetter == 'P') {
      hebrewLetter = PAY;
      if (!AtEnd(i, text) && NextChar(i, text) == 'H') {
        i += nextCharSpan;
      }
    } else if (englishLetter == 'Q') {
      hebrewLetter = KUF;
    } else if (englishLetter == 'R') {
      hebrewLetter = RAISH;
    } else if (englishLetter == 'S') {
      if (!AtEnd(i, text)) {
        if (TrueNextChar(i, text) == 'S') {
          if (yiddish) {
            hebrewLetter = SAMEKH;
          } else {
            hebrewLetter = SHIN;
          }
          i += nextCharSpan;
        } else if (NextChar(i, text) == 'Z' || NextChar(i, text) == 'H') {
          hebrewLetter = SHIN;
          i += nextCharSpan;
        } else if (NextChar(i, text) == 'T' && !yiddish) {
          hebrewLetter = SHIN + TESS;
          i += nextCharSpan;
        } else {
          hebrewLetter = SAMEKH;
          if (!yiddish) {
            hebrewLetter = hebrewLetter + '|' + SHIN;
          }
          if (ashkenazi) {
            hebrewLetter = hebrewLetter + '|' + TAF;
          }
        }
      } else {
        hebrewLetter = SAMEKH;
        if (!yiddish) {
          hebrewLetter = hebrewLetter + '|' + SHIN;
        }
        if (ashkenazi) {
          hebrewLetter = hebrewLetter + '|' + TAF;
        }
      }
    } else if (englishLetter == 'T') {
      if (
        !AtEnd(i, text) &&
        (NextChar(i, text) == 'S' || NextChar(i, text) == 'Z')
      ) {
        hebrewLetter = AtEnd(i + 1, text) ? TSADI2 : TSADI;
        i += nextCharSpan;
      } else if (
        !AtEnd(i, text) &&
        NextChar(i, text) == 'C' &&
        !AtEnd(i + 1, text) &&
        NextChar(i + 1, text) == 'H'
      ) {
        // do nothing (TCH is same as CH
      } else if (yiddish) {
        hebrewLetter = TESS;
      } else {
        hebrewLetter = AtEnd(i, text) ? TESS + '|' + TAF : TESS;
      }
    } else if (englishLetter == 'U') {
      if (AtStart(i, text)) {
        hebrewLetter = ALEF + VAV;
      } else {
        hebrewLetter = VAV;
      }
    } else if (englishLetter == 'V') {
      if (yiddish) {
        hebrewLetter = VAV + VAV;
      } else {
        hebrewLetter = BAIS + '|' + VAV;
      }

      /*
          } else if (englishLetter == 'W') {
            if (yiddish) {
              hebrewLetter = VAV + VAV;
            } else if (AtStart(i, text)) {
              hebrewLetter = VAV;
            } else {
              hebrewLetter = BAIS;
            }
*/
    } else if (englishLetter == 'W') {
      if (yiddish) {
        hebrewLetter = VAV + VAV;
      } else {
        hebrewLetter = VAV + VAV + '|' + VAV;
      }
    } else if (englishLetter == 'X') {
      hebrewLetter = KUF + SAMEKH;
    } else if (englishLetter == 'Y') {
      hebrewLetter = YUD;
    } else if (englishLetter == 'Z') {
      if (yiddish) {
        hebrewLetter = ZAYIN;
      } else if (NextChar(i, text) == 'H') {
        hebrewLetter = ZAYIN + GERESH;
        i += nextCharSpan;
      } else {
        hebrewLetter = ZAYIN;
      }
    } else if (englishLetter >= '0' && englishLetter <= '9') {
      hebrewLetter = englishLetter;
    } else {
      hebrewLetter = ' ';
    }

    if (possibilities == 'one' && hebrewLetter.indexOf('|') != -1) {
      hebrewLetter = hebrewLetter.substr(0, hebrewLetter.indexOf('|'));
    }

    var hebrewLetterArray = hebrewLetter.split('|');
    var letterCount = hebrewLetterArray.length;
    var wordCount = hebrewText.length;
    for (var letterIndex = 1; letterIndex < letterCount; letterIndex++) {
      for (var wordIndex = 0; wordIndex < wordCount; wordIndex++) {
        hebrewText[letterIndex * wordCount + wordIndex] = hebrewText[wordIndex];
      }
    }
    for (var letterIndex = 0; letterIndex < letterCount; letterIndex++) {
      for (var wordIndex = 0; wordIndex < wordCount; wordIndex++) {
        hebrewText[letterIndex * wordCount + wordIndex] +=
          hebrewLetterArray[letterIndex];
      }
    }
  }

  // avoid more than two consecutive VAVs -- for example WUNDER should not be VAV VAV VAV NUN ...

  if (!yiddish) {
    for (var x = 0; x < hebrewText.length; x++) {
      hebrewText[x].replace(VAV + VAV + VAV, VAV + VAV, 'g');
    }
  }

  // change last character of each word to the suffit form
  for (var x = 0; x < hebrewText.length; x++) {
    for (var len = 0; len <= hebrewText[x].length; len++) {
      if (len == hebrewText[x].length || hebrewText[x].charAt(len) == ' ') {
        var lastChar = len < 1 ? '' : hebrewText[x].charAt(len - 1);
        var nextToLastChar = len < 2 ? '' : hebrewText[x].charAt(len - 2);
        var change = false;
        if (lastChar == KAF) {
          lastChar = KHAF2;
          change = true;
        } else if (lastChar == MEM) {
          lastChar = MEM2;
          change = true;
        } else if (lastChar == NUN) {
          lastChar = NUN2;
          change = true;
        } else if (lastChar == PAY) {
          lastChar = FAY2;
          change = true;
        } else if (lastChar == TSADI) {
          lastChar = TSADI2;
          change = true;
        }
        if (change) {
          hebrewText[x] =
            hebrewText[x].substr(0, len - 1) +
            lastChar +
            hebrewText[x].substr(len);
        }
        if (lastChar == GERESH && nextToLastChar == TSADI) {
          hebrewText[x] = hebrewText[x].substr(0, len - 2) + TSADI2 + GERESH;
        }
      }
    }
  }

  //return(hebrewText.join(', '));
  return hebrewText[0];
}

function rus_to_eng(str) {
  var ru = {
      а: 'a',
      б: 'b',
      в: 'v',
      г: 'g',
      д: 'd',
      е: 'e',
      ё: 'e',
      ж: 'j',
      з: 'z',
      и: 'i',
      к: 'k',
      л: 'l',
      м: 'm',
      н: 'n',
      о: 'o',
      п: 'p',
      р: 'r',
      с: 's',
      т: 't',
      у: 'u',
      ф: 'f',
      х: 'h',
      ц: 'c',
      ч: 'ch',
      ш: 'sh',
      щ: 'shch',
      ы: 'y',
      э: 'e',
      ю: 'u',
      я: 'ya',
    },
    n_str = [];

  str = str.replace(/[ъь]+/g, '').replace(/й/g, 'i');

  for (var i = 0; i < str.length; ++i) {
    n_str.push(
      ru[str[i]] ||
        (ru[str[i].toLowerCase()] == undefined && str[i]) ||
        ru[str[i].toLowerCase()].toUpperCase()
    );
  }
  return n_str.join('');
}

export const transliterateRuHeb = (text) => {
  return eng_to_hebrew(rus_to_eng(text));
};