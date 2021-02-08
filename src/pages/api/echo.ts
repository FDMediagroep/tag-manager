async function handler(req, res) {
    console.log(req.body);
    res.end(JSON.stringify(req.body));
}

export default handler;
