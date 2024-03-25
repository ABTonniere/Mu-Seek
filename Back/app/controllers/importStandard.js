let locks = {};

module.exports = {
	/*
	 * Crée une fonction qui recherche un objet dans notre base de donnée.
	 * param model : Le modèle de la table à manipuler.
	 * param objet : Le nom de l'objet (ex: "l'import standard")
	 * renvoit la fonction créer.
	 */
	get: function(model,objet){
		return async function(elem){
			if(!( elem["_id"] )){
				throw {
					message: "Impossible de vérifier si l'objet existe déjà dans la base de donnée.",
					erreur: "_id est vide ou inexistant.",
					objet: elem
				};
			}
			try{
				const res = await model.findById(elem._id);
				return res;
			} catch (err) {
				throw {
					message: "Impossible d'accéder à la base de donnée, pour vérifier la présence de "+objet+" ayant un _id "+elem._id,
					erreur: err,
					objet: elem
				};
			}
		};
	},

	/*
	 * Crée une fonction qui recherche un objet dans notre base de donnée.
	 * param model : Le modèle de la table à manipuler.
	 * param objet : Le nom de l'objet (ex: "l'import standard")
	 * param field : Le champs de l'objet à utilisé pour la recherche.
	 * renvoit la fonction créer.
	 */
	getBy: function(model,objet,field){
		return async function(elem) {
			if(!( elem[field] )){
				throw {
					message: "Impossible de vérifier si "+objet+" existe déjà dans la base de donnée.",
					erreur: field+" est vide ou inexistant.",
					objet: elem
				};
			}
			try{
				let req = {};
				req[field] = elem[field];
				const res = await model.findOne(req);
				return res;
			} catch (err) {
				throw {
					message: "Impossible d'accéder à la base de donnée, pour vérifier la présence de "+objet+" ayant un "+field+" "+elem[field],
					erreur: err,
					objet: elem
				};
			}
		};
	},

	/*
	 * Crée une méthode qui ajoute un nouvelle objet.
	 * param model : Le modèle de la table à manipuler.
	 * param getter : La fonction pour chercher si l'objet existe déjà dans la table.
	 * param field : Le champs de l'objet à utilisé pour la recherche de d'un doublon.
	 * renvoit la fonction créer.
	 */
	ajouter: function(model, getter, lockName){
		locks[lockName] = false;
		return async function(obj){
			while( locks[lockName] ){
				await new Promise(resolve => setTimeout(resolve, 100));
			}
			locks[lockName] = true;
			try {
				const objet = await getter(obj).catch(err => {
					throw {
						message: "Impossible de vérifier la présence de l'objet dans la base de donnée, afin d'éviter les doublons.",
						erreur: err,
						objet: obj
					}
				});
				let res = null;
				if( objet ){
					res = { objet: objet, creer: false };
				} else {
					let result;
					try {
						result = await model.create(obj);
					} catch (err) {
						console.log("L'objet suivant n'à pas put être mongooser.",obj,err,"\n");
						throw {
							message: 'Impossible de créer le mongoose object.',
							erreur: err,
							data: obj
						};
					}
					result.save().catch((err) => {
						throw {
							message: "Erreur lors de l'envoie à mongodb.",
							error: err,
							objet: result
						};
					});
					res = { objet: result, creer: true };
				}
				return res;
			} finally {
				locks[lockName] = false;
			}
		};
	},

	/*
	 * Crée une fonction permettant à un objet de s'inscrire à un autre.
	 * param model: Le model de l'objet manipulé. (celui au-quelle s'inscrire)
	 * param lst: Le champs où s'incrire.
	 * param nomInviter: Le nom du modele de celui essayant de s'inscrire.
	 * renvoit la fonction créer, qui prend en paramètre l'id de l'objet à modifier, puis l'id de l'objet s'inscrivant.
	 */
	subscribe: function(model,lst,nomInviter){
		return async function(idConteneur,idContenu){
			model.findById(idConteneur).then(obj => {
				if( !obj ){
					throw new Error(model.modelName+' '+idConteneur+' non trouvée');
				}
				obj[lst].push(idContenu);
				return obj.save();
			}).catch(err => {
				throw {
					message: "Impossible pour l'invité de s'incrire.",
					inviter: {
						type: nomInviter,
						id: idContenu
					},
					dans: model.modelName+"."+lst,
					id: idConteneur,
					erreur: err
				};
			});
		}
	},

	/*
	 * Cherche tout les objet matchant le pattern
	 */
	search: function(model,field){
		return async function(regex){
			try{
				let obj = {};
				obj[field] = regex;
				res = await model.find(obj);
				return res;
			} catch (err) {
				throw {
					message: "Une erreur s'est produite lors de la recherche d'un " + field + " dans la table " + model.modelName,
					error: err
				}
			}
		};
	}
};
