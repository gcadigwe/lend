import React, { useState, useEffect, useRef } from 'react'
import { createChart, CrosshairMode } from 'lightweight-charts'
import { formattedNum } from '../../utils'
import dayjs from 'dayjs'
interface Props {
  data: any[]
  width: any
  height?: number
  base: any
  margin: boolean
  valueFormatter: any
}

const CandleStickChart = ({
  data,
  width,
  height = 200,
  base,
  margin = true,
  valueFormatter = (val: any) => formattedNum(val, true)
}: Props) => {
  // reference for DOM element to create with chart
  const ref = useRef<HTMLDivElement>()
  const [chartCreated, setChartCreated] = useState(false)
  const [candle, setCandle] = useState()

  useEffect(() => {
    if (!chartCreated && data.length > 1) {
      const chart = createChart(ref.current as any, {
        width: width,
        height: height,
        layout: {
          backgroundColor: 'transparent',
          textColor: 'black'
        },
        grid: {
          vertLines: {
            color: 'rgba(197, 203, 206, 0.5)'
          },
          horzLines: {
            color: 'rgba(197, 203, 206, 0.5)'
          }
        },
        crosshair: {
          mode: CrosshairMode.Normal
        },
        rightPriceScale: {
          borderColor: 'rgba(197, 203, 206, 0.8)',
          visible: true
        },
        timeScale: {
          borderColor: 'rgba(197, 203, 206, 0.8)'
        },
        localization: {
          priceFormatter: (val: any) => formattedNum(val)
        }
      })

      const candleSeries = chart.addCandlestickSeries({
        upColor: '#5E7AF5',
        downColor: '#ff4976',
        borderDownColor: '#ff4976',
        borderUpColor: '#5E7AF5',
        wickDownColor: '#838ca1',
        wickUpColor: '#838ca1'
      })
      setCandle(candleSeries as any)
      candleSeries.setData(data as any)
      // @todo: Need more setup to be working
      const toolTip = document.createElement('div')
      toolTip.setAttribute('id', 'tooltip-id')
      toolTip.className = 'three-line-legend'
      ref.current?.appendChild(toolTip)
      toolTip.style.display = 'block'
      toolTip.style.left = (margin ? 116 : 10) + 'px'
      toolTip.style.top = 50 + 'px'
      toolTip.style.backgroundColor = 'transparent'
      // get the title of the chart
      const setLastBarText = () => {
        toolTip.innerHTML = true
          ? `<div style="font-size: 22px; margin: 4px 0px; color: ${'black'}">` + valueFormatter(base) + '</div>'
          : ''
      }
      setLastBarText()
      // update the title when hovering on the chart
      chart.subscribeCrosshairMove(function(param: any) {
        if (
          param === undefined ||
          param.time === undefined ||
          param.point.x < 0 ||
          param.point.x > width ||
          param.point.y < 0 ||
          param.point.y > height
        ) {
          setLastBarText()
        } else {
          const price = param.seriesPrices.get(candleSeries).close
          const time = dayjs.unix(param.time).format('MM/DD h:mm A')
          toolTip.innerHTML =
            `<div style="font-size: 22px; margin: 4px 0px; color: black">` +
            valueFormatter(price) +
            `<span style="font-size: 12px; margin: 4px 6px; color: black">` +
            time +
            ' UTC' +
            '</span>' +
            '</div>'
        }
      })
      chart.timeScale().fitContent()
      setChartCreated(chart as any)
    }
    //@ts-ignore
    candle?.setData(data as any)
  }, [chartCreated, data, width, height, valueFormatter, candle, margin, base])

  // useEffect(() => {
  //   chartCreated.can
  // }, [data])
  return <div ref={ref as any} className="chart-container"></div>
}

export default CandleStickChart
