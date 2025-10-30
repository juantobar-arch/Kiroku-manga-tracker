import fs from 'fs';
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(__filename);

// Base de datos en memoria usando JSON (temporal hasta que se resuelva sqlite3)
class JSONDatabase {
    constructor(dbPath) {
        this.dbPath = dbPath;
        this.data = this.load();
        this.autoIncrement = {
            users: this.data.users.length > 0 ? Math.max(...this.data.users.map(u => u.id)) + 1 : 1,
            anime: this.data.anime.length > 0 ? Math.max(...this.data.anime.map(a => a.id)) + 1 : 1,
            user_anime: this.data.user_anime.length > 0 ? Math.max(...this.data.user_anime.map(ua => ua.id)) + 1 : 1
        };
    }

    load() {
        if (fs.existsSync(this.dbPath)) {
            return JSON.parse(fs.readFileSync(this.dbPath, 'utf-8'));
        }
        return { users: [], anime: [], user_anime: [] };
    }

    save() {
        fs.writeFileSync(this.dbPath, JSON.stringify(this.data, null, 2));
    }

    prepare(sql) {
        return {
            run: async (...params) => {
                const sqlLower = sql.toLowerCase();
                
                if (sqlLower.includes('insert into users')) {
                    const id = this.autoIncrement.users++;
                    const [email, password, username] = params;
                    
                    if (this.data.users.some(u => u.email === email)) {
                        throw new Error('UNIQUE constraint failed');
                    }
                    
                    this.data.users.push({
                        id,
                        email,
                        password,
                        username,
                        created_at: new Date().toISOString()
                    });
                    this.save();
                    return { lastInsertRowid: id, changes: 1 };
                }
                
                if (sqlLower.includes('insert into anime')) {
                    const id = this.autoIncrement.anime++;
                    const [title, description, cover_image, total_episodes, genres, rating] = params;
                    this.data.anime.push({
                        id,
                        title,
                        description,
                        cover_image,
                        total_episodes,
                        genres,
                        rating,
                        created_at: new Date().toISOString()
                    });
                    this.save();
                    return { lastInsertRowid: id, changes: 1 };
                }
                
                if (sqlLower.includes('insert into user_anime')) {
                    const id = this.autoIncrement.user_anime++;
                    const [user_id, anime_id, status, current_episode, rating, notes] = params;
                    
                    if (this.data.user_anime.some(ua => ua.user_id === user_id && ua.anime_id === anime_id)) {
                        throw new Error('UNIQUE constraint failed');
                    }
                    
                    this.data.user_anime.push({
                        id,
                        user_id,
                        anime_id,
                        status,
                        current_episode,
                        rating,
                        notes,
                        updated_at: new Date().toISOString()
                    });
                    this.save();
                    return { lastInsertRowid: id, changes: 1 };
                }
                
                if (sqlLower.includes('update user_anime')) {
                    const [status, current_episode, rating, notes, id, user_id] = params;
                    const index = this.data.user_anime.findIndex(ua => ua.id === parseInt(id) && ua.user_id === user_id);
                    
                    if (index === -1) return { changes: 0 };
                    
                    this.data.user_anime[index] = {
                        ...this.data.user_anime[index],
                        status,
                        current_episode,
                        rating,
                        notes,
                        updated_at: new Date().toISOString()
                    };
                    this.save();
                    return { changes: 1 };
                }
                
                if (sqlLower.includes('delete from user_anime')) {
                    const [id, user_id] = params;
                    const initialLength = this.data.user_anime.length;
                    this.data.user_anime = this.data.user_anime.filter(ua => !(ua.id === parseInt(id) && ua.user_id === user_id));
                    const changes = initialLength - this.data.user_anime.length;
                    if (changes > 0) this.save();
                    return { changes };
                }
                
                return { changes: 0 };
            },
            
            get: async (...params) => {
                const sqlLower = sql.toLowerCase();
                
                if (sqlLower.includes('from users where email')) {
                    return this.data.users.find(u => u.email === params[0]);
                }
                
                if (sqlLower.includes('from anime where id')) {
                    return this.data.anime.find(a => a.id === parseInt(params[0]));
                }
                
                if (sqlLower.includes('count(*)')) {
                    return { count: this.data.anime.length };
                }
                
                return null;
            },
            
            all: async (...params) => {
                const sqlLower = sql.toLowerCase();
                
                if (sqlLower.includes('from anime where 1=1')) {
                    let results = [...this.data.anime];
                    
                    if (sqlLower.includes('title like')) {
                        const searchTerm = params[0].replace(/%/g, '').toLowerCase();
                        results = results.filter(a => a.title.toLowerCase().includes(searchTerm));
                    }
                    
                    return results;
                }
                
                if (sqlLower.includes('from user_anime ua')) {
                    const [user_id, status] = params;
                    let results = this.data.user_anime.filter(ua => ua.user_id === user_id);
                    
                    if (status) {
                        results = results.filter(ua => ua.status === status);
                    }
                    
                    // Join con anime
                    return results.map(ua => {
                        const anime = this.data.anime.find(a => a.id === ua.anime_id);
                        return {
                            ...ua,
                            title: anime?.title,
                            cover_image: anime?.cover_image,
                            total_episodes: anime?.total_episodes,
                            genres: anime?.genres,
                            anime_rating: anime?.rating
                        };
                    }).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
                }
                
                return [];
            }
        };
    }

    close() {
        this.save();
    }
}

export function connectDB() {
    const dbPath = path.join(dirname, 'kiroku.json');
    const db = new JSONDatabase(dbPath);
    
    console.log('✅ Database connected (JSON mode)');
    return db;
}
