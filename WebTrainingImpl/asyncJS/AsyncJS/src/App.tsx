import { useRef, useState } from 'react'
import type { GitHubUser } from './Model/User';
import type { GitHubRepository } from './Model/Repo';

function App() {
  const [user, setUser] = useState("")
  const [userDetails, setUserDetails] = useState<GitHubUser[]>([]);
  const [userDetailsError, setUserDetailsError] = useState("No User Content Available")
  const [repoDetails, setRepoDetails] = useState<GitHubRepository[]>([]);
  const [userRepoDetailsError, setUserRepoDetailsError] = useState("No Repo ContentAvailable")
  const repoIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser(e.target.value);
  }

  const getUserDetails = async (): Promise<void> => {
   if (repoIntervalRef.current) {
      clearInterval(repoIntervalRef.current);
      console.log("Interval stopped!");
    }
    
    try {
      const response = await fetch(`https://api.github.com/users/${user}`);
    
      if (!response.ok) {
        throw new Error(`User not found: ${response.status}`);
      }

      const data = await response.json();
      // console.log(data);
      setUserDetails([data])
      setUserDetailsError("")
    } catch (error) {
      console.error("Failed to fetch user details:", error);  
      setUserDetailsError(String(error))
    }
  }

  const getRepoDetails = async (): Promise<void> => {
    console.log("Get Repo without interval");

    if (repoIntervalRef.current) clearInterval(repoIntervalRef.current);
    
    try {
      const response = await fetch(`https://api.github.com/users/${user}/repos`);
    
      if (!response.ok) {
        throw new Error(`User not found: ${response.status}`);
      }

      const data = await response.json();
      // console.log(data);
      setRepoDetails([data])
      setUserRepoDetailsError("")
    } catch (error) {
      console.error("Failed to fetch user details:", error);  
      setUserRepoDetailsError(String(error))
    }

    repoIntervalRef.current = setInterval(async () => {
      try {
        const response = await fetch(`https://api.github.com/users/${user}/repos`);
    
        if (!response.ok) {
          throw new Error(`User not found: ${response.status}`);
        }

        const data = await response.json();
        // console.log(data);
        setRepoDetails([data])
        setUserRepoDetailsError("")
      } catch (error) {
        console.error("Failed to fetch user details:", error);  
        setUserRepoDetailsError(String(error))
      }
    }, 60000);
};


  return (
    <> 
    <div>
      <h1 className='m-5 text-amber-950'>GitHub repository tracker</h1>
      <input 
        type="text" 
        value={user}
        onChange={handleChange}
        placeholder='Enter UserName'
        className='w-2xl border-2 m-5'
        />
    </div>
    <div>
      <button 
      type="button" 
      className='bg-amber-700 p-2 mx-5'
      onClick={getUserDetails}
      >
        Get User Details
      </button>
      
      <button 
      type="button" 
      className='bg-amber-700 p-2 mx-5'
      onClick={getRepoDetails}
      >
        Get {user == "" ? "user" : user}'s Repo Details
      </button>
    </div>

    <div className='flex-1 grid grid-cols-2 gap-6 p-4'>

      <div className="flex flex-col border-2 m-5 p-3">
      {userDetailsError != "" ? (
        <div className='text-red-700'>{userDetailsError}</div>
        ) : (
          userDetails?.map((ele: GitHubUser) => (
            <div key={ele.id} className='bg-gray-300 m-1 p-3'>
              {ele.login}
            </div>
          ))  
      )}
      </div>

      <div className="flex flex-col border-2 m-5 p-3">
      {userRepoDetailsError != "" ? (
        <div className='text-red-700'>{userRepoDetailsError}</div>
        ) : (
          <>
          {repoDetails?.flat().length <= 0 ? (
            <div className='text-green-500'>No Repo Available</div>
          ) : (
            repoDetails?.flat().map((ele: GitHubRepository) => (
            <div key={ele.id} className='bg-gray-400 m-1 p-3'>
              {ele.name}
              </div>
              ))
            )
          }
          </>
        )}
      </div>
    </div>
    

    </>
  )
}

export default App
