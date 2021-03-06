/*
 * Tests for imgITools
 */

const Ci = Components.interfaces;
const Cc = Components.classes;

function getFileInputStream(aFile) {
    var inputStream = Cc["@mozilla.org/network/file-input-stream;1"].
                      createInstance(Ci.nsIFileInputStream);
    inputStream.init(aFile, 0x01, -1, null);
    // Blah. The image decoders use ReadSegments, which isn't implemented on
    // file input streams. Use a buffered stream to make it work.
    var bis = Cc["@mozilla.org/network/buffered-input-stream;1"].
              createInstance(Ci.nsIBufferedInputStream);
    bis.init(inputStream, 1024);

    return bis;
}

function do_get_file(path, allowNonexistent) {
  try {
    let lf = Components.classes["@mozilla.org/file/directory_service;1"]
      .getService(Components.interfaces.nsIProperties)
      .get("CurWorkD", Components.interfaces.nsILocalFile);

    let bits = path.split("/");
    for (let i = 0; i < bits.length; i++) {
      if (bits[i]) {
        if (bits[i] == "..")
          lf = lf.parent;
        else
          lf.append(bits[i]);
      }
    }

    return lf;
  }
  catch (ex) {
    do_throw(ex.toString(), Components.stack.caller);
  }

  return null;
}



var imgTools = Cc["@mozilla.org/image/tools;1"].
               getService(Ci.imgITools);

dump(1);
var imgName = arguments[0];
dump(2);
var inMimeType = arguments[1];
dump(3);
var imgFile = do_get_file(imgName);
dump(4);
var istream = getFileInputStream(imgFile);
dump(5);
var outParam = { value: null };
imgTools.decodeImageData(istream, inMimeType, outParam);
var img = outParam.value;


//Components.classes["@mozilla.org/gfx/region;1"].createInstance(Components.interfaces.nsIScriptableRegion).init()


var canvas = Cc["@mozilla.org/xul/xul-document;1"].createInstance(Ci.nsIDOMDocument).implementation.createDocument("http://www.w3.org/1999/xhtml", "html", null).createElementNS("http://www.w3.org/1999/xhtml", "canvas");
//canvas = canvas.QueryInterface(Components.interfaces.nsIDOMHTMLCanvasElement);
canvas.setAttribute("height", 32);
canvas.setAttribute("width", 32);

dump(7);

var context = canvas.getContext('2d');
context.drawImage(img, 0, 0);

dump(8);



//imgTools.encodeScaledImage(container, "image/bmp", 16, 16)
dump('\n');
