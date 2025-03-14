import { reject } from "bcrypt/promises.js";
import db from "../config/db_pg.js";

const getPokemonByID = (id) => {
    return new Promise((resolve, reject) => {

        const requete = 'SELECT nom, type_primaire, type_secondaire, pv, attaque, defense FROM pokemon WHERE id = $1';
        const params = [id]

        db.query(requete, params, (erreur, resultat) =>{
            if (erreur){
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
                return
            }
            resolve(resultat.rows);
        });
    });
};

const getListePokemon = (type, limit, offset) => {
    return new Promise((resolve, reject) => {
        let requete = '';
        let params = [];

        if (type) {
            requete = 'SELECT nom, type_primaire, type_secondaire, pv, attaque, defense FROM pokemon WHERE type_primaire = $1 LIMIT $2 OFFSET $3';
            params = [type, limit, offset];
        } else {
            requete = 'SELECT nom, type_primaire, type_secondaire, pv, attaque, defense FROM pokemon LIMIT $1 OFFSET $2';
            params = [limit, offset];
        }

        db.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
                return;
            }
            resolve(resultat.rows);
        });
    });
};

const addPokemon = (nom, type_primaire, type_secondaire, pv, attaque, defense) => {
    return new Promise((resolve, reject) => {
        
        let requete = 'INSERT INTO pokemon (nom, type_primaire, type_secondaire, pv, attaque, defense) VALUES ($1, $2, $3, $4, $5, $6)';
        let params = [nom, type_primaire, type_secondaire, pv, attaque, defense];

        db.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
                return;
            }
            resolve(resultat.rows);
        });
    });
};

const alterPokemon = (id, nom, type_primaire, type_secondaire, pv, attaque, defense) => {
    return new Promise((resolve, reject) =>{

        let requete = "UPDATE pokemon SET nom = $1, type_primaire = $2, type_secondaire = $3, pv = $4, attaque = $5, defense = $6 WHERE id = $7";
        let params = [nom, type_primaire, type_secondaire, pv, attaque, defense, id];

        console.log(requete, "\n", params);

        db.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
                return;
            }
            resolve(resultat.rows);
        });
    });
};

const alterKey = (cle, courriel) => {
    return new Promise((resolve, reject) => {

        let requete = "UPDATE utilisateurs SET cle_api = $1 WHERE courriel = $2";
        let params = [cle, courriel];

        db.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
                return;
            }
            resolve(resultat.rows);
        });
    });
};

const verifierMotDePasse = (courriel) => {
    if (!courriel) {
        return Promise.reject(new Error("Paramètre courriel manquant"));
    }

    console.log("Courriel reçu dans verifierMotDePasse:", courriel);

    return new Promise((resolve, reject) => {
        let requete = "SELECT mot_de_passe FROM utilisateurs WHERE courriel = ?";
        let params = [courriel];

        db.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur SQL (${erreur.sqlState}) : ${erreur.sqlMessage}`);
                reject(erreur);
                return;
            }

            if (resultat.length === 0 || !resultat[0].mot_de_passe) {
                reject(new Error("Utilisateur non trouvé ou mot de passe invalide"));
                return;
            }

            resolve(resultat[0].mot_de_passe); // Retourne seulement la chaîne du mot de passe
        });
    });
};


const deletePokemon = (id) => {
    return new Promise((resolve, reject) => {

        let requete = "DELETE FROM pokemon WHERE id = $1";
        let params = [id];

        db.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
                return;
            }
            resolve(resultat.rows);
        });
    });
};

const addUser = (nom, courriel, mot_de_passe, cle_api) => {
    return new Promise((resolve, reject) => {

        let requete = "INSERT INTO utilisateurs (nom, courriel, mot_de_passe, cle_api) VALUES ($1, $2, $3, $4)";
        let params = [nom, courriel, mot_de_passe, cle_api];

        db.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
                return
            }
            resolve(resultat.rows);
        });
    });
};

const verifierCourriel = (courriel) => {
    return new Promise((resolve, reject) => {
        const requete = "SELECT courriel FROM utilisateurs WHERE courriel = $1";
        const params = [courriel];

        db.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                console.error(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
                return;
            }
            if (resultat.length > 0) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
};


const validationCle = (cleApi) => {
    return new Promise((resolve, reject) => {
        const requete = "SELECT cle_api FROM utilisateurs WHERE cle_api = $1";
        const params = [cleApi];

        db.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                console.error(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
                return;
            }
            if (resultat.length > 0) {
                resolve("La clé API est valide!");
            } else {
                reject("La clé API est invalide!");
            }
        });
    });
};

const retrouverCle = (courriel) => {
    return new Promise((resolve, reject) => {

        const requete = "SELECT cle_api FROM utilisateurs WHERE courriel = $1";
        const params = [courriel]

        db.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
                return
            }
            resolve(resultat.rows);
        });
    });
};


export default {
    getPokemonByID,
    getListePokemon,
    addPokemon,
    alterPokemon,
    deletePokemon,
    addUser,
    verifierCourriel,
    alterKey,
    verifierMotDePasse,
    retrouverCle
}
export {validationCle}
