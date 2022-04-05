using GameAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace GameAPI.Repositories.Interfaces
{
    public interface IGameRepository
    {
        Task<IEnumerable<ResultGame>> GetResultgames();
        Task<ResultGame> Create(ResultGame resultGame);
    }
}
