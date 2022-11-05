import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
const defaultImg = 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/generic.svg'

const CryptoIcon: React.FC<{ name: string }> = ({ name }) => {
  const [imgUrl, setImgUrl] = useState<string>(defaultImg)

  useEffect(() => {
    const isImgExist = async () => {
      try {
        const url = `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/32/icon/${name.toLocaleLowerCase()}.png`
        const res = await axios.get(url)
        if (res.status === 200) setImgUrl(url)
      } catch (error) {}
    }
    isImgExist()
  }, [])

  return <img src={imgUrl} alt={name} />
}

export default CryptoIcon
