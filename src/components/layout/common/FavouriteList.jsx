import { ListItem, Box, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import boardApi from "../../../api/boardApi"
import { setFavouriteList } from '../../../redux/features/favouriteSlice'

const FavouriteList = () => {
  const dispatch = useDispatch()
  const list = useSelector((state) => state.favourites?.value)
  const [activeIndex, setActiveIndex] = useState(0)
  const { boardId } = useParams()

  useEffect(() => {
    const getBoards = async () => {
      try {
        const res = await boardApi.getFavourites()
        dispatch(setFavouriteList(res))
      } catch (err) {
        alert(err)
      }
    }
    getBoards()
  }, [])
  

  return (
    <>
      <ListItem>
          <Box sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Typography variant='body2' fontWeight='700'>
              Favourite
            </Typography>
          </Box>
        </ListItem>
    </>
  )
}

export default FavouriteList