import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

interface ReadLengthHistogramProps {
    readLengthDistribution: { [key: string]: number };
}

interface ChartData {
    length: number;
    count: number;
}

const ReadLengthHistogram: React.FC<ReadLengthHistogramProps> = ({ readLengthDistribution }) => {
    const d3Container = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (d3Container.current && readLengthDistribution) {
            const data: ChartData[] = Object.entries(readLengthDistribution).map(([length, count]) => ({
                length: +length,
                count
            })).sort((a, b) => a.length - b.length);

            const margin = { top: 20, right: 20, bottom: 60, left: 60 };
            const width = 925 - margin.left - margin.right;
            const height = 500 - margin.top - margin.bottom;

            d3.select(d3Container.current).selectAll('*').remove();

            const svg = d3.select(d3Container.current).append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);

            const x = d3.scaleBand()
                .range([0, width])
                .padding(0.1)
                .domain(data.map(d => d.length.toString()));

            const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.count) || 0])
                .range([height, 0]);

            svg.append('g')
                .attr('transform', `translate(0,${height})`)
                .call(d3.axisBottom(x).tickValues(x.domain().filter((_d, i) => !(i % 25))))
                .selectAll("text")
                .attr("transform", "translate(-10,0)rotate(-45)")
                .style("text-anchor", "end");

            svg.append('g')
                .call(d3.axisLeft(y));

            svg.selectAll('.bar')
                .data(data)
                .enter().append('rect')
                .attr('class', 'bar')
                .attr('x', d => x(d.length.toString())!)
                .attr('width', x.bandwidth())
                .attr('y', d => y(d.count))
                .attr('height', d => height - y(d.count))
                .attr('fill', 'steelblue');

            svg.append('text')
                .attr('text-anchor', 'end')
                .attr('x', width / 2)
                .attr('y', height + margin.top + 30)
                .text('Read Length');

            svg.append('text')
                .attr('text-anchor', 'end')
                .attr('transform', 'rotate(-90)')
                .attr('y', -margin.left + 20)
                .attr('x', -height / 2)
                .text('Frequency');
        }
    }, [readLengthDistribution]);

    return (
        <div>
            <div ref={d3Container} />
        </div>
    );
};

export default ReadLengthHistogram;
