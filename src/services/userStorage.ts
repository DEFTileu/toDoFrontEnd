import { User } from '../types';

const KEY = 'auth_user';

// Миграция: если есть раздельные ключи user_*, собрать их в объект и записать в auth_user
(function migrateSeparated(){
  try {
    if (localStorage.getItem(KEY)) return; // уже есть новый формат
    const prefix = 'user_';
    const possible = ['id','email','name','createdAt','emailNotification','avatar'];
    const collected: any = {};
    let found = false;
    possible.forEach(f=>{
      const v = localStorage.getItem(prefix+f);
      if(v !== null){
        found = true;
        if(v === 'true' || v === 'false') collected[f] = v === 'true'; else collected[f] = v;
      }
    });
    if(found && collected.id){
      localStorage.setItem(KEY, JSON.stringify(collected));
      // очистить старые ключи
      possible.forEach(f=> localStorage.removeItem(prefix+f));
    }
  } catch {}
})();

export const userStorage = {
  store(user: User){
    try { localStorage.setItem(KEY, JSON.stringify(user)); } catch {}
  },
  get(): User | null {
    try {
      const raw = localStorage.getItem(KEY);
      if(!raw) return null;
      return JSON.parse(raw) as User;
    } catch { return null; }
  },
  update(partial: Partial<User>){
    const current = this.get();
    if(!current){
      if(partial.id) this.store(partial as User);
      return;
    }
    this.store({ ...current, ...partial });
  },
  clear(){
    try { localStorage.removeItem(KEY); } catch {}
  }
};
