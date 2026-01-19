import * as React from "react"
import Svg, { Defs, G, Path, SvgProps } from "react-native-svg"
const IconRewind = (props: SvgProps) => (
  <Svg fill="none" {...props}>
    <G fill={props.fill} fillRule="evenodd" clipRule="evenodd" filter="url(#a)">
      <Path d="M28.5 2.292a1.333 1.333 0 0 1 2.167 1.041v21.334a1.333 1.333 0 0 1-2.167 1.04L15.167 15.042a1.333 1.333 0 0 1 0-2.082L28.5 2.292Z" />
      <Path d="M15.167 2.292a1.333 1.333 0 0 1 2.166 1.041v21.334a1.333 1.333 0 0 1-2.166 1.04L1.834 15.042a1.333 1.333 0 0 1 0-2.082L15.167 2.292Z" />
    </G>
    <Defs></Defs>
  </Svg>
)
export default IconRewind
