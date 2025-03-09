import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


const chatContext = createContext()

const ChatProvider = ({children}) =>{
    const [user, setUser] = useState(null)
    const [selectedChat, setSelectedChat] = useState(null)
    const [chats, setChats] = useState([])
    const [fetchAgain, setFetchAgain] = useState(false)
    const [notification, setNotification] = useState([])

    const navigate = useNavigate()

    useEffect(()=>{
        const userInfo = JSON.parse(localStorage.getItem("userInfo"))

        if (userInfo) {
            setUser(userInfo)
        }else{
            setUser(null);
            setSelectedChat(null);
            setChats([]);
            setNotification([]);
            navigate("/");
        }
    },[navigate])

    useEffect(() => {
        if (!user) {
            setSelectedChat(null);
            setChats([]);
            setNotification([]);
        }
    }, [user]);
    return(
        <chatContext.Provider value={{user, setUser, selectedChat, setSelectedChat, chats, setChats, fetchAgain, setFetchAgain, notification, setNotification}}>
            {children}
        </chatContext.Provider>
    )
}

export const chatState = () =>{
    return useContext(chatContext)
}


export default ChatProvider