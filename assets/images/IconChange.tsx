import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"
const IconChange = (props: SvgProps) => (
  <Svg fill="none" {...props}>
    <Path
      fill={props.fill}
      fillRule="evenodd"
      d="M17.793 1.793a1 1 0 0 1 1.414 0l3 3a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-.566.283l-3.5.5a1 1 0 0 1-1.13-1.131l.5-3.5a1 1 0 0 1 .282-.566l9-9Zm-7.35 10.178-.264 1.85 1.85-.264L20.086 5.5 18.5 3.914l-8.057 8.057Z"
      clipRule="evenodd"
    />
    <Path
      fill={props.fill}
      fillRule="evenodd"
      d="M5 6.5A1.5 1.5 0 0 0 3.5 8v11A1.5 1.5 0 0 0 5 20.5h11a1.5 1.5 0 0 0 1.5-1.5v-7.5h2V19a3.5 3.5 0 0 1-3.5 3.5H5A3.5 3.5 0 0 1 1.5 19V8A3.5 3.5 0 0 1 5 4.5h7.5v2H5Z"
      clipRule="evenodd"
    />
  </Svg>
)
export default IconChange
