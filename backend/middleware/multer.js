import multer from "multer";
import os from "os";

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, os.tmpdir());   // ✅ store files in system temp directory instead of "uploads/"
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage });
console.log("✅ Multer middleware loaded");

export default upload;




// import multer from "multer";
// import os from "os";

// const storage = multer.memoryStorage();   // ✅ changed only this line

// const upload = multer({ storage });
// console.log("✅ Multer middleware loaded");

// export default upload;

