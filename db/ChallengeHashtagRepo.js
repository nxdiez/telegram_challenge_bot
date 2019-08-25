class ChallengeHashtagRepo {
    _tabHashtags = 'challenge_hashtags';
    constructor(dao){
        this.dao = dao;
    };
    createTables(drop){
        if(!drop){
            const sql = `
                CREATE TABLE IF NOT EXISTS ` + _tabHashtags + `(
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        hashtag TEXT,
                        type TEXT,
                        active INTEGER DEFAULT 0)`
                return this.dao.run(sql)          
        }
    };
    create( hashtag ){
        this.dao.run('INSERT INTO ' + _tabHashtags + ' (hashtag,type) VALUES (?,?)',
        [name, 'photo'])
    }
    
    
}

module.exports = ChallengeHashtagRepo;