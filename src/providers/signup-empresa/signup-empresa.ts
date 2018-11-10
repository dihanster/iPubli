import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class SignupEmpresaProvider {

  private PATH = 'signup-empresa/';

  constructor(private db: AngularFireDatabase) {
  }

  getAll() {
    return this.db.list(this.PATH, ref => ref.orderByChild('name'))
      .snapshotChanges()
      .map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
      })
  }

  get(key: string) {
    return this.db.object(this.PATH + key).snapshotChanges()
      .map(c => {
        return { key: c.key, ...c.payload.val() };
      });
  }

  save(empresa: any) {
    return new Promise((resolve, reject) => {
      if (empresa.key) {
        this.db.list(this.PATH)
          .update(empresa.key, { name: empresa.name, cnpj: empresa.cnpj, empresakey: empresa.empresakey, email: empresa.email, password: empresa.password })
          .then(() => resolve())
          .catch((e) => reject(e));
      } else {
        this.db.list(this.PATH)
          .push({ name: empresa.name, cnpj: empresa.cnpj, empresakey: empresa.empresakey, email: empresa.email, password: empresa.password })
          .then(() => resolve());
      }
    })
  }

  remove(key: string) {
    return this.db.list(this.PATH).remove(key);
  }
}