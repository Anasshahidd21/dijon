module.exports = ({
    req
}, errorString) => {
    return `<div>
<form method="POST">
    <input name="email" placeholder="email" />
    <input name="password" placeholder="password" />
    <button>Sign In</button>
    <div class = "errorPrint">${errorString}</div>
</form>
</div>`
}