import { app } from '../config/firebase-config';
import { getFirestore, collection, doc, getDoc, getDocs, addDoc, deleteDoc, setDoc, query, where, orderBy, limit } from 'firebase/firestore';

const db = getFirestore(app);

/**
 *  API for FIrestore database
 */
export default class Database {
    /**
     * Create a new Database
     * @param {*} collectionPath Path to the collection in the database
     */
    constructor(collectionPath) {
        this.collectionPath = collectionPath;
        this.collectionRef = collection(db, collectionPath);
    }

    /**
     * Gets a document's data based on UID, appended with a UID property
     * @example
     * const db = Database('myCollection');
     * db.get('myDocUID').then((doc) => {
     *     console.log(`Data for document ${doc.id}: ${doc}`);
     * });
     * @param {String} docUID Existing document UID
     * @returns {Promise}
     */
    async get(docUID) {
        return new Promise(async (resolve, reject) => {
            if (docUID === '') {
                reject(new ReferenceError('docUID cannot be empty.'));
            } else {
                const docRef = doc(this.collectionRef, docUID);
                await getDoc(docRef)
                .then((dataSnapshot) => {
                    if (dataSnapshot.exists()) {
                        resolve({...dataSnapshot.data(), id: docUID});
                    } 
                    else {
                        reject(new ReferenceError('Document with id "' + docUID + '" does not exist in collection: ' + this.collection));
                    }
                })
                .catch((error) => {
                    reject(error);
                });
            }
        });
    }

    /**
     * Gets all the documents in a collection
     * @example
     * const db = Database('myCollection');
     * db.getCollection().then((docs) => {
     *     for (const doc of docs) {
     *         console.log(doc);
     *     }
     * });
     * @returns {Promise}
     */
    async getCollection() {
        return new Promise(async (resolve, reject) => {
            await getDocs(this.collectionRef)
            .then((dataSnapshot) => {
                if (dataSnapshot.docs.length !== 0) {
                    const docRefs = dataSnapshot.docs;
                    const docs = docRefs.map((docRef) => ({ ...docRef.data(), id: docRef.id }));
                    resolve(docs);
                }
                else {
                    reject(new ReferenceError('No documents in collection'));
                }
            })
            .catch((e) => {
                reject(e);
            })
        });
    }

    /**
     * Private querying method to return an array of all `QueryDocumentSnapshot<DocumentData>`
     * with matching fields.
     * @example
     * const db = Database('myCollection');
     * const myPattern = {'myField': 'a'};
     * db.#_queryMatches(myPattern).then((docRefs) => {
     *     for (const docRef of docRefs) {
     *         console.log(`Document ${docRef.id}: ${docRef.docs}`)
     *     }
     * });
     * @example
     * const db = Database('myCollection');
     * // Field value is >= a but < b
     * const myPattern = {'myField': {'>=': 'a', '<': 'c'}};
     * db.#_queryMatches(myPattern).then((docRefs) => {
     *     for (const docRef of docRefs) {
     *         console.log(`Document ${docRef.id}: ${docRef.docs}`)
     *     }
     * });
     * @param {*} fieldValuePairs Object containing `{ field: value }` pairs to be matched against
     * The `value` of these pairs can either be a `String`, checking if the document `field` value equals `value`.
     * Or an `Object` of form `{ operator: value, ... }`, checking if the document `field` value compares to `value` based on `operator`
     * @param {String} sortBy The field used to sort the documents. Default: `null`
     * @param {number} lim The maximum number of documents returned. Default: `null`
     * @returns {Promise<QueryDocumentSnapshot<DocumentData>[]} Promise that resolves the array of 
     * `QueryDocumentSnapshot<DocumentData>` if the query finds matching documents
     */
    async #_queryMatches(fieldValuePairs, sortBy=null, lim=null) {
        return new Promise(async (resolve, reject) => {
            const queryConstraints = [];
            for (const field in fieldValuePairs) {
                const fieldValue = fieldValuePairs[field];
                // Handle default
                if (typeof fieldValue == 'string') {
                    queryConstraints.push(where(field.toString(), '==', fieldValue));
                }
                // Handle variable number of custom operators
                else {
                    for (const operator in fieldValue) {
                        queryConstraints.push(where(field.toString(), operator.toString(), fieldValue[operator]));
                    }
                }
            }
            if (sortBy) {
                if (sortBy instanceof Array) {
                    for (const field of sortBy) {
                        queryConstraints.push(orderBy(field));
                    }
                }
                else {
                    queryConstraints.push(orderBy(sortBy));
                }
            }
            if (lim) {
                queryConstraints.push(limit(lim));
            }

            const queryResult = query(this.collectionRef, ...queryConstraints);
            await getDocs(queryResult)
            .then((snapshot) => {
                if (snapshot.docs.length === 0)
                    reject(new ReferenceError('No matches.'))
                else
                    resolve(snapshot.docs);
            })
            .catch((error) => {
                reject(error);
            });
        });
    }

    /**
     * Querying method to return an array of all `DocumentData`
     * with matching fields. Each document element has an added `id` property as the document's UID.
     * @example
     * const db = Database('myCollection');
     * const myPattern = {'myField': 'a'};
     * db.queryMatches(myPattern).then((docs) => {
     *     for (const doc of docs) {
     *         console.log(`Document ${doc.id}: ${doc}`)
     *     }
     * });
     * @example
     * const db = Database('myCollection');
     * // Field value is >= a but < b
     * const myPattern = {'myField': {'>=': 'a', '<': 'c'}};
     * db.queryMatches(myPattern).then((docs) => {
     *     for (const doc of docs) {
     *         console.log(`Document ${doc.id}: ${doc}`)
     *     }
     * });
     * @param {*} fieldValuePairs Object containing `{ field: value }` pairs to be matched against
     * The `value` of these pairs can either be a `String`, checking if the document `field` value equals `value`.
     * Or an `Object` of form `{ operator: value, ... }`, checking if the document `field` value compares to `value` based on `operator`
     * @param {String} sortBy The field used to sort the documents. Default: `null`
     * @param {number} lim The maximum number of documents returned. Default: `null`
     * @returns { Promise } Promise that resolves to the array of `DocumentData` if the query finds matching documents
     */
    async queryMatches(fieldValuePairs, orderBy=null, lim=null) {
        return new Promise(async (resolve, reject) => {
            this.#_queryMatches(fieldValuePairs, orderBy, lim)
            .then((docRefs) => {
                const docs = docRefs.map((docRef) => ({ ...docRef.data(), id: docRef.id }));
                resolve(docs);
            })
            .catch((error) => {
                reject(error);
            });
        });
    }

    /**
     * Create a new document
     * If existing documents contain the same { field: value } pairs as
     * the new document in the list of fields `matchFields`,
     * then the document cannot be created.
     * @example
     * const db = Database('myCollection');
     * const data = { 'myField': 'myValue', 'matchField': 'matchValue' };
     * const matchFields = ['matchField'];
     * 
     * db.create(data, matchFields).then((docRef) => {
     *     console.log(`Document with ID "${docRef.id}" created`);
     * });
     * 
     * @param {*} docData `Object` containing `{ field: value }` pairs for the new document
     * @param {*} matchFields `Object` containing `{ field: value }` pairs that will be checked for existence
     * @returns {Promise<DocumentReference<any>} Promise that resolves if the new document is able to be created
     */
    async create(docData, matchFields=[]) {
        return new Promise(async (resolve, reject) => {
            if (!matchFields.every(field => Object.keys(docData).includes(field))) {
                reject(new SyntaxError('Document does not include all fields.'));
            }
            const fieldValuePairs = {}
            for (const field of matchFields) {
                fieldValuePairs[field] = docData[field];
            }

            this.queryMatches(fieldValuePairs)
            .then((docs) => {
                if (docs.length !== 0) {
                    reject(new ReferenceError('Document with fields already exist'));
                }
                else {
                    resolve(addDoc(this.collectionRef, docData));
                }
            });
        });
    }

    /**
     * Updates an existing document based on document UID
     * @example
     * const db = Database('myCollection');
     * const newData = { 'myField': 'myValue' };
     * 
     * db.update('myDocUID', newData).then(() => {
     *     console.log('Document updated');
     * });
     * @param {String} docUID Existing document UID
     * @param {*} docData `Object` containing `{ field: value }` pairs that will overwrite 
     * the existing document or be added as new fields
     * @returns { Promise<void> } Promise that resolves if the existing document is able to be updated
     */
    async update(docUID, docData) {
        return new Promise(async (resolve, _) => {
            this.get(docUID)
            .then(() => {
                const docRef = doc(this.collectionRef, docUID);;
                resolve(setDoc(docRef, docData));
            })
        })
    }

    /**
     * Updates existing documents that match to `{ field: value }` pairs
     * @example
     * const db = Database('myCollection');
     * const matchPairs = { 'matchField': 'matchValue' };
     * const newData = { 'myField': 'myValue' };
     * 
     * db.updateMatches(matchPairs, newData).then((updateCount) => {
     *     console.log(`${updateCount} Documents updated`);
     * });
     * @param {*} fieldValuePairs `Object` containing `{ field: value }` pairs used to match against
     * @param {*} docData `Object` containing `{ field: value }` pairs that will overwrite 
     * the matched documents or be added as new fields
     * @returns { Promise<number> } Promise that resolves to the number of updated documents if at least one document is updated
     */
    async updateMatches(fieldValuePairs, docData) {
        return new Promise(async (resolve, reject) => {
            this.#_queryMatches(fieldValuePairs)
            .then((docRefs) => {
                let updateCount = 0;
                for (const docRef of docRefs) {
                    setDoc(docRef, docData);
                    updateCount++;
                }
                resolve(updateCount);
            });
        })
    }

    /**
     * Deletes an existing document based on document UID
     * @example
     * const db = Database('myCollection');
     * 
     * db.delete('myDocUID').then(() => {
     *     console.log('Document deleted');
     * });
     * @param {*} docUID Existing document UID
     * @returns { Promise<void> } Promise that resolves if the existing document has been deleted
     */
    async delete(docUID) {
        return new Promise(async (resolve, reject) => {
            const docRef = doc(this.collectionRef, docUID);
            this.get(docUID)
            .then(() => {
                resolve(deleteDoc(docRef));
            })
            .catch(() => {
                reject(new ReferenceError('Document does not exist.'));
            })
        });
    }

    /**
     * Deletes existing documents that match to `{ field: value }` pairs
     * @example
     * const db = Database('myCollection');
     * const matchPairs = { 'matchField': 'matchValue' };
     * 
     * db.deleteMatches(matchPairs).then((deleteCount) => {
     *     console.log(`${deleteCount} Documents updated`);
     * });
     * @param {*} fieldValuePairs `Object` containing `{ field: value }` pairs used to match against
     * @returns { Promise<number> } Promise that resolves if at least one document is deleted
     */
    async deleteMatches(fieldValuePairs) {
        return new Promise(async (resolve, reject) => {
            this.#_queryMatches(fieldValuePairs)
            .then((docRefs) => {
                if (docRefs.length === 0)
                    reject(new ReferenceError('No matching documents.'));
                let deleteCount = 0;
                for (const docRef of docRefs) {
                    this.delete(docRef.id);
                }
                resolve(deleteCount);
            })
        })
    }

    /**
     * More advanced querying methods
     */

    async queryPrefix(fieldPrefixPair, sort=false, lim=null) {
        const [field, prefix] = Object.entries(fieldPrefixPair)[0];
        const pattern = {[field]: {'>=': prefix, '<=': prefix + '\uf8ff'}};
        return this.queryMatches(pattern, sort ? field : null, lim);
    }
}