using GameAPI.Models;
using GameAPI.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GameController : ControllerBase
    {
        private readonly IGameRepository _gameRepository;

        public GameController(IGameRepository gameRepository)
        {
            _gameRepository = gameRepository;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ResultGame>>> GetResultGames()
        {
            var resultGames = await _gameRepository.GetResultgames();
            return Ok(resultGames);
        }
        [HttpPost]
        public async Task<ActionResult<ResultGame>> InsertResultGame(ResultGame resultGame)
        {
            var lResultGame = await _gameRepository.Create(resultGame);
            return Ok(lResultGame);

        }

    }
}
