class ChallengeParticipantsRepo {
    _tabParticipants = 'challenge_participants';
    constructor(dao){
        this.dao = dao;
    };
    createTables(drop){
        if(!drop){
            const sql = `
                CREATE TABLE IF NOT EXISTS ` + this._tabParticipants + `(
                    id_hashtag INTEGER,
                    id_user TEXT,
                    hashtag TEXT,
                    id_user_at TEXT,
                    file_id TEXT,
                    valid INTEGER DEFAULT 0,
                    CONSTRAINT participants_fk_id_hashtag FOREIGN KEY (id_hashtag)
                        REFERENCES challenge_hashtags(id) ON UPDATE CASCADE ON DELETE CASCADE )`
                return this.dao.run(sql)          
        }
    }
    
}

module.exports = ChallengeHashtagRepo;