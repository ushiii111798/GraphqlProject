// Function itself support ES6, but package.json cannot configure type:module
// So we need to user require instead
// Using latest libraries
const { Storage } = require('@google-cloud/storage');
const sharp = require('sharp');

exports.resizeImage = async (event, context) => {
  // Event name contains full dir and filename(which includes extension)
  // Filename includes extension because it is configured by backend server

  // This function can be triggered by generating thumbnail because thumbnails are saved in GCS as well
  // So, if event.name includes _TN_ or thumb/, it means this function is triggered by generating thumbnail
  // If it is triggerd by generating thumbnail, stop function by return nothing
  if (event.name.includes('_TN_') || event.name.includes('thumb/')) return;

  // Pre-define thumbnail generate options by array with [size, saving directory name] pattern
  const option = [
    // Config 320 with s, 640 with m, 1280 with l
    [320, 's'],
    [640, 'm'],
    [1280, 'l'],
  ];
  // Backend Request Form uuid.extension
  const name = event.name.split('.').shift();
  const extension = event.name.split('.').pop();
  console.log(`Name: ${name}, Extension: ${extension}`);

  // generally we need keyfiles for accessing bucket
  // since cloud function and GCS are operated under same account, we don't need it
  // event contains its triggered bucket name, so use it
  const storage = new Storage().bucket(event.bucket);

  // homework requirement: using Promise.all
  await Promise.all(
    // we have an array of options contains target size and dir name for each size
    // using map get each option's target size as target and dir name as dir
    option.map(([target, dir]) => {
      // generate promise by each options
      return new Promise((resolve, reject) => {
        // doing something with storage
        storage
          .file(`${name}.${extension}`) // get file from storage
          .createReadStream() // read file and convert buffer to stream
          .pipe(sharp().resize({ width: target })) // resize image with target size, since image is stream, use pipe
          .pipe(storage.file(`thumb/${dir}/${name}_TN_${target}.${extension}`).createWriteStream()) // save thumbnail to storage, stream write
          // so the final thumbnails will be saved into 'thumb/each size' directory
          // file name pattern: (original file uuid)_TN_(target size).(extension)
          // ex) oooooooo-oooo-oooo-oooo-oooooooooooo_TN_320.jpeg
          .on('finish', () => {
            // when everything is finished log thumbnail is created
            console.log(`Thumbnail Created : thumb/${dir}/${name}_TN_${target}.${extension}`);
            // and resolve promise
            resolve();
          })
          .on('error', () => reject()); // if any error occur during the promise, reject promise
      });
    }),
  );
};
