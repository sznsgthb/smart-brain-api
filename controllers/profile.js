export const handleProfile = (req, res, db) => {
    const { id } = req.params;
    
    db.select('*').from('users').where({ id })
        .then(user => {
            if (user.length) {
                res.json(user[0])
            } else {
                res.status(400).json('Hmm, nothing found...')
            }
        })
        .catch(err => res.status(400).json('Oops. Does that user exist?'))
};