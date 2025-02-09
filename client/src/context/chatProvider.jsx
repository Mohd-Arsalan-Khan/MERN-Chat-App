import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


const chatContext = createContext()

const ChatProvider = ({children}) =>{
    const [user, setUser] = useState(null)
    const navigate = useNavigate()

    useEffect(()=>{
        const userInfo = JSON.parse(localStorage.getItem("userInfo"))

        if (userInfo) {
            setUser(userInfo)
        }else{
            navigate("/")
        }
    },[navigate])
    return(
        <chatContext.Provider value={{user, setUser}}>
            {children}
        </chatContext.Provider>
    )
}

export const chatState = () =>{
    return useContext(chatContext)
}


export default ChatProvider