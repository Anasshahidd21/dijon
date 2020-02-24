module.exports = ({
    req
}, errorString) => {
    return `<div>
${req.session.userID}
<form method="POST">
    <input name="email" placeholder="email" />
    <input name="password" placeholder="password" />
    <input name="passwordConfirmation" placeholder="passwordConfirmation" />
    <button>Sign up</button>
    <div class = "errorPrint">${errorString}</div>
</form>
</div>`
};