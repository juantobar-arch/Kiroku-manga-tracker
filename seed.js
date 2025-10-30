import { connectDB } from './db.js';

const db = connectDB();

// Datos de ejemplo de animes
const animes = [
    {
        title: 'Attack on Titan',
        description: 'Humanity lives within cities surrounded by enormous walls as a defense against the Titans, gigantic humanoid creatures.',
        cover_image: 'https://cdn.myanimelist.net/images/anime/10/47347.jpg',
        total_episodes: 87,
        genres: 'Action, Drama, Fantasy',
        rating: 9.0
    },
    {
        title: 'Demon Slayer',
        description: 'A family is attacked by demons and only two members survive - Tanjiro and his sister Nezuko, who is turning into a demon slowly.',
        cover_image: 'https://cdn.myanimelist.net/images/anime/1286/99889.jpg',
        total_episodes: 44,
        genres: 'Action, Adventure, Fantasy',
        rating: 8.7
    },
    {
        title: 'My Hero Academia',
        description: 'A superhero-loving boy without any powers is determined to enroll in a prestigious hero academy and learn what it really means to be a hero.',
        cover_image: 'https://cdn.myanimelist.net/images/anime/10/78745.jpg',
        total_episodes: 113,
        genres: 'Action, Comedy, School',
        rating: 8.4
    },
    {
        title: 'One Piece',
        description: 'Follows the adventures of Monkey D. Luffy and his pirate crew in order to find the greatest treasure ever left by the legendary Pirate, Gold Roger.',
        cover_image: 'https://cdn.myanimelist.net/images/anime/6/73245.jpg',
        total_episodes: 1000,
        genres: 'Action, Adventure, Comedy',
        rating: 8.7
    },
    {
        title: 'Jujutsu Kaisen',
        description: 'A boy swallows a cursed talisman and becomes cursed himself. He enters a shaman\'s school to be able to locate the demon\'s other body parts.',
        cover_image: 'https://cdn.myanimelist.net/images/anime/1171/109222.jpg',
        total_episodes: 24,
        genres: 'Action, Fantasy, Supernatural',
        rating: 8.6
    },
    {
        title: 'Death Note',
        description: 'An intelligent high school student goes on a secret crusade to eliminate criminals from the world after discovering a notebook capable of killing anyone.',
        cover_image: 'https://cdn.myanimelist.net/images/anime/9/9453.jpg',
        total_episodes: 37,
        genres: 'Mystery, Psychological, Thriller',
        rating: 9.0
    },
    {
        title: 'Naruto',
        description: 'Naruto Uzumaki, a mischievous adolescent ninja, struggles as he searches for recognition and dreams of becoming the Hokage.',
        cover_image: 'https://cdn.myanimelist.net/images/anime/13/17405.jpg',
        total_episodes: 220,
        genres: 'Action, Adventure, Comedy',
        rating: 8.3
    },
    {
        title: 'Fullmetal Alchemist: Brotherhood',
        description: 'Two brothers search for a Philosopher\'s Stone after an attempt to revive their deceased mother goes awry.',
        cover_image: 'https://cdn.myanimelist.net/images/anime/1223/96541.jpg',
        total_episodes: 64,
        genres: 'Action, Adventure, Drama',
        rating: 9.1
    },
    {
        title: 'Steins;Gate',
        description: 'A group of friends discover a way to send messages to the past and alter the timeline, with dangerous consequences.',
        cover_image: 'https://cdn.myanimelist.net/images/anime/5/73199.jpg',
        total_episodes: 24,
        genres: 'Sci-Fi, Thriller, Drama',
        rating: 9.1
    },
    {
        title: 'Sword Art Online',
        description: 'Players of a virtual reality MMORPG find themselves trapped in the game and must fight to escape.',
        cover_image: 'https://cdn.myanimelist.net/images/anime/11/39717.jpg',
        total_episodes: 96,
        genres: 'Action, Adventure, Fantasy',
        rating: 7.6
    }
];

console.log('🌱 Seeding database...');

async function seed() {
    try {
        // Insertar animes
        for (const anime of animes) {
            try {
                const stmt = db.prepare(
                    'INSERT INTO anime (title, description, cover_image, total_episodes, genres, rating) VALUES (?, ?, ?, ?, ?, ?)'
                );
                await stmt.run(
                    anime.title,
                    anime.description,
                    anime.cover_image,
                    anime.total_episodes,
                    anime.genres,
                    anime.rating
                );
                console.log(`✅ Added: ${anime.title}`);
            } catch (error) {
                console.log(`⚠️  Skipped: ${anime.title} (already exists)`);
            }
        }

        console.log('\n✅ Database seeded successfully!');
        const countStmt = db.prepare('SELECT COUNT(*) as count FROM anime');
        const result = await countStmt.get();
        console.log(`📊 Total animes in database: ${result.count}`);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        db.close();
    }
}

seed();
