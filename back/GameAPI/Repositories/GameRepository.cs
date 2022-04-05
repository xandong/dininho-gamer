using Firebase.Database;
using Firebase.Database.Query;
using GameAPI.Models;
using GameAPI.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameAPI.Repositories
{
    public class GameRepository : IGameRepository
    {
        FirebaseClient _firebase = new FirebaseClient("https://gameapi-71df6-default-rtdb.firebaseio.com/");

        public async Task<IEnumerable<ResultGame>> GetResultgames()
        {
            List<ResultGame> lResultGamesCollection = new List<ResultGame>();
            var resultGames = await _firebase
                .Child("ResultGame")
                .OrderByKey()
                .LimitToFirst(10)
                .OnceAsync<ResultGame>();

            foreach (var item in resultGames)
            {
                lResultGamesCollection.Add(item.Object);
            }

            return lResultGamesCollection.OrderByDescending(x => x.Score);
        }

        public async Task<ResultGame> Create(ResultGame prResultGame)
        {
            prResultGame.DateOfGame = DateTime.Now.ToString("dd/MM/yyyy");
            var lResultGame = await _firebase
              .Child("ResultGame")
              .PostAsync(prResultGame);

            return lResultGame.Object;
        }
    }
}
