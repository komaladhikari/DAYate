import {assets} from '../assets/assets.js'
import './Header.css'

const Header = () => {
  return (
    <div className="header">
      <img src={assets.image2} alt="DAYate logo" className="logo" />
    </div>
  )
}

export default Header
