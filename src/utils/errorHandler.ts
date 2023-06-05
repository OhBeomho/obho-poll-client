export default function (err: Error) {
  alert(`An error occurred.\nError message: ${err.message}`);
  console.error(`${err.message}\n${err.stack}`);
}
