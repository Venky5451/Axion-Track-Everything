import {
  BsMoonStars,
  BsSun,
  BsChevronLeft,
  BsChevronRight,
  BsChevronUp,
  BsChevronDown,
  BsActivity,
  BsFire,
  BsCheck2,
} from "react-icons/bs"
import {
  AiOutlineEllipsis,
  AiOutlineWarning,
  AiOutlinePlus,
} from "react-icons/ai"
import { MdDeleteForever, MdOutlineLogout, MdEdit } from "react-icons/md"
import { BiCalendar, BiHistory, BiDollarCircle, BiCheckSquare, BiCheck,  BiTime, BiError} from "react-icons/bi"
import { FaUserAlt, FaSort } from "react-icons/fa"
import { ImSpinner8, ImStatsBars } from "react-icons/im"
import { RxDashboard, RxMixerHorizontal } from "react-icons/rx"
import { LuSettings } from "react-icons/lu"

interface IconsType {
  [key: string]: React.ElementType
}

export const Icons: IconsType = {
  // Dashboard Icons
  dashboard: RxDashboard,
  activity: BsActivity,
  settings: LuSettings,
  dollarSign: BiDollarCircle,
  checkSquare: BiCheckSquare,
  check: BiCheck,
  clock: BiTime,
  alertTriangle: BiError,

  // Mode Toggle
  moon: BsMoonStars,
  sun: BsSun,

  // Navigation
  back: BsChevronLeft,
  next: BsChevronRight,
  up: BsChevronUp,
  down: BsChevronDown,
  

  // Common
  trash: MdDeleteForever,
  spinner: ImSpinner8,
  userAlt: FaUserAlt,
  ellipsis: AiOutlineEllipsis,
  warning: AiOutlineWarning,
  add: AiOutlinePlus,
  history: BiHistory,
  signout: MdOutlineLogout,
  calendar: BiCalendar,
  sort: FaSort,
  fire: BsFire,
  statsBar: ImStatsBars,
  mixer: RxMixerHorizontal,
  check: BsCheck2,
}


