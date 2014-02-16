fs = require('fs');
child_process = require('child_process');

try {
  require('neon');
} catch (e) {
  console.log("neon is not available!");
  process.exit(1);
}

var dir = process.argv[2] || "assets/js/vendor/neon"

var command = "cp -r ./node_modules/neon " + dir

child_process.exec(command, function (err, stderr, stdout) {
  if (err || stderr) {
    console.log("Something went wrong.", err, stderr);
    process.exit(1);
  }
  console.log("Neon copied");
  process.exit(0);
});
