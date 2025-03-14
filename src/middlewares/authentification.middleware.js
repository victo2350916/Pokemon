import { validationCle } from "../models/pokemon.model.js";

const authentification = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ message: "vous devez fournir une clé api" });
    }

    const cleApi = req.headers.authorization.split(' ')[1];
    validationCle(cleApi)
        .then(resultat => {
            if (!resultat) {
                return res.status(401).json({ message: "Clé API invalide" });
            } else {
                next();
            }
        })
        .catch(erreur => {
            return res.status(500).json({ message: "Erreur lors de la validation de la clé API" });
        });
}

export default authentification;
