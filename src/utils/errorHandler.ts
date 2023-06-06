export default function (err: Error, callback?: () => any) {
  alert(`An error occurred.\nError message: ${err.message}`);
  console.error(`${err.message}\n${err.stack}`);

  callback && callback();
}
