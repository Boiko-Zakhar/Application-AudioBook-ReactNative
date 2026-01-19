import * as React from "react"
import Svg, { Defs, G, Path, SvgProps } from "react-native-svg"
const IconFastForward = (props: SvgProps) => (
  <Svg fill="none" {...props}>
    <G fill={props.fill} fillRule="evenodd" clipRule="evenodd" filter="url(#a)">
      <Path d="M3.5 2.292a1.333 1.333 0 0 0-2.167 1.041v21.334a1.333 1.333 0 0 0 2.167 1.04l13.333-10.666a1.333 1.333 0 0 0 0-2.082L3.5 2.292Z" />
      <Path d="M16.833 2.292a1.333 1.333 0 0 0-2.166 1.041v21.334a1.333 1.333 0 0 0 2.166 1.04l13.333-10.666a1.334 1.334 0 0 0 0-2.082L16.833 2.292Z" />
    </G>
    <Defs></Defs>
  </Svg>
)
export default IconFastForward
