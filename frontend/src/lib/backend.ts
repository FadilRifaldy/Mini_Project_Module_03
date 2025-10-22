import axios from "axios";

// const API_KEY = "2e79acdcf95f4b4a9fafddc26d3cefc8";
// // const BASE_URL = "https://newsapi.org/v2"
const BASE_URL = "http://localhost:8500/event/all";

// interface IArticle{
//     title:string
//     description:string
//     url:string
//     urlToImage:string
// }

export interface IEvent {
  id: string;                
  title: string;
  imgUrl: string;            
  content: string;           
  date: string;              
  location: string;          
  price: number;            
  totalTickets: number;     
  availableTickets: number;  
  createdAt?: string;        
  updatedAt?: string;        
}


export async function getNewsHeadline(search?: string): Promise<IEvent[]> {
  try {
    const url = search
      ? `${BASE_URL}?search=${encodeURIComponent(search)}`
      : BASE_URL;

    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getEventDetail(objectId: string) {
  try {
    const res = await axios.get(`${BASE_URL}/${objectId}`);
    return res.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getUpcomingEvents(): Promise<IEvent[]> {
  try {
    // hanya ambil 3 artikel terbaru
    const res = await axios.get(`${BASE_URL}`); //?pageSize=3&sortBy=created%20desc
    return res.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
