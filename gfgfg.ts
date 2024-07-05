function extractDataFromDBBOSS(document: Document): IRecord[] {
    const tbody = document.querySelector('.panel-body');
    if (!tbody) {
        throw new Error('tbody element not found');
    }

    const data: IRecord[] = [];
    const rows = tbody.querySelectorAll('tr');
    let lastStartDate: Date | null = null;

    rows.forEach((row, rowIndex) => {
        if (rowIndex === 0) return;

        const cells = row.querySelectorAll('th, td');
        for (let cellIndex = 0; cellIndex < cells.length; cellIndex += 3) {
            if (cellIndex + 2 < cells.length) {
                const dateRangeCell = cells[cellIndex].innerHTML.replace(/<br\s*\/?>/gi, ' ').replace(/\s+/g, ' ');
                const dateRange = dateRangeCell.match(/(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/g);

                const leftPanel = cleanText(cells[cellIndex + 1]?.innerHTML || '***');
                const pair = cleanText(cells[cellIndex + 2]?.innerHTML || '**');
                const rightPanel = cleanText(cells[cellIndex + 3]?.innerHTML || '***');

                let date: string;
                if (dateRange && dateRange.length === 2) {
                    const totalDays = calculateTotalDays(dateRange[0], dateRange[1]);
                    date = formatSpecificDate(dateRange[0]);
                    lastStartDate = parseDate(dateRange[0]);
                    for (let day = 0; day < totalDays; day++) {

                        data.push({
                            leftPanel,
                            pair,
                            rightPanel,
                            date
                        });
                    }
                } else if (lastStartDate) {
                    lastStartDate = addDays(lastStartDate, 1);
                    date = format(lastStartDate, 'dd/MM/yyyy');
                    data.push({
                        leftPanel,
                        pair,
                        rightPanel,
                        date
                    });
                }
            }
        }
    });

    return data
}