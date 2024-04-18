const PDFDocument = require('pdfkit');
const moment = require('moment');
const PDFTableDocument = require('pdfmake');

const createInvoice = (invoice, path, res) => {
  let doc = new PDFDocument({ size: 'A4', margin: 50 });

  // generateHeader(doc, invoice);
  // generateStatementTitle(doc, invoice);
  // generateSalesTable(doc, invoice);
  // generateFooter(doc);

  var fonts = {
    Roboto: {
      normal: './src/assets/fonts/Roboto-Regular.ttf',
      bold: './src/assets/fonts/Roboto-Bold.ttf',
      italics: './src/assets/fonts/Roboto-Italic.ttf',
      bolditalics: './src/assets/fonts/Roboto-BoldItalic.ttf',
    },
    NunitoSans: {
      normal: './src/assets/fonts/NunitoSans-Regular.ttf',
      bold: './src/assets/fonts/NunitoSans-Bold.ttf',
    },
  };
  var printer = new PDFTableDocument(fonts);
  var date = '';
  var total = 0;

  // generate sales table record
  const salesList = invoice.items.map((item, index) => {
    var statement = '';

    // accumulate total
    total = parseFloat(total) + parseFloat(item?.total);

    // loop through order
    var serviceList = invoice.items[index].order.map((list, index) => {
      if (index > 0) statement += '\n';
      return (statement += `${list.quantity} x ${
        list.service.name
      } = (${formatCurrency(list.service.price)})`);
    });

    // append freebies info if exists
    if (invoice.items[index].freebie.length > 0) {
      var freebiesList = invoice.items[index].freebie.map((list, index) => {
        statement += '\n';
        return (statement += `${list.quantity} x ${list.name} = (${list.point} pts)`);
      });
    }

    return [
      {
        text: moment(item.createdAt).format('DD/MM/YY'),
        style: { fontSize: 10 },
        border: [false, true, false, true],
        margin: [0, 4],
        style: { fontSize: 10 },
      },
      {
        text: item.customer_id.name,
        border: [false, true, false, true],
        margin: [0, 4],
        style: { fontSize: 10 },
      },
      {
        text: item.branch_id?.name,
        border: [false, true, false, true],
        margin: [0, 4],
        style: { fontSize: 10 },
      },
      {
        text: item.barber_id.full_name,
        border: [false, true, false, true],
        margin: [0, 4],
        style: { fontSize: 10 },
      },
      {
        text: statement,
        border: [false, true, false, true],
        margin: [0, 4],
        style: { fontSize: 10 },
      },
      {
        text: formatCurrency(item.total),
        border: [false, true, false, true],
        margin: [0, 4],
        style: { fontSize: 10 },
      },
    ];
  });

  // generate sales stats table record
  const salesStatsList = invoice.staff_stats.map((item, index) => {
    return [
      {
        text: item.staff_name,
        border: [false, true, false, true],
        margin: [0, 4],
        style: { fontSize: 10 },
      },
      {
        text: item.branch.name,
        border: [false, true, false, true],
        margin: [0, 4],
        style: { fontSize: 10 },
      },
      {
        text: formatCurrency(item.total_sale),
        border: [false, true, false, true],
        margin: [0, 4],
        style: { fontSize: 10 },
      },
    ];
  });

  // json with invoice layout
  var docDefinition = {
    content: [
      // {
      //   columns: [
      //     {
      //       image: './src/assets/images/logo.png',
      //       width: 45,
      //     },
      //     // {
      //     //   // star-sized columns fill the remaining space
      //     //   // if there's more than one star-column, available width is divided equally
      //     //   width: '55%',
      //     // },
      //     {
      //       // % width
      //       width: '90%',
      //       style: {
      //         alignment: 'right',
      //         fontSize: 10,
      //       },
      //       text: [
      //         invoice.company.name + '\n',
      //         invoice.company.address + '\n',
      //         invoice.company.city +
      //           ', ' +
      //           invoice.company.postcode +
      //           ' ' +
      //           invoice.company.state,
      //       ],
      //     },
      //   ],
      //   // optional space between columns
      //   columnGap: 10,
      // },
      {
        image: './src/assets/images/logo.png',
        width: 45,
      },
      {
        text: `${invoice.type === 'annual' ? 'ANNUAL' : 'MONTHLY'} STATEMENT`,
        style: {
          fontSize: 16,
          bold: true,
          alignment: 'justify',
        },
        margin: [0, 5, 0, 1],
        alignment: 'center',
      },
      {
        text: `${
          invoice.type === 'annual'
            ? moment(invoice.date).format('YYYY')
            : moment(invoice.date).format('MMMM').toUpperCase()
        }`,
        style: {
          fontSize: 16,
          bold: true,
          alignment: 'justify',
        },
        margin: [0, 0, 0, 5],
        alignment: 'center',
      },
      {
        text: 'Sales History',
        style: {
          fontSize: 12,
          bold: true,
        },
        margin: [0, 5, 0, 10],
      },
      {
        fontSize: 11,
        table: {
          pageBreak: 'before',
          widths: ['10%', '20%', '15%', '15%', '30%', '10%'],
          body: [
            [
              {
                text: 'Date',
                border: [false, true, false, true],
                margin: [0, 4],
                style: { bold: true },
              },
              {
                text: 'Customer Name',
                border: [false, true, false, true],
                margin: [0, 4],
                style: { bold: true },
              },
              {
                text: 'Branch',
                border: [false, true, false, true],
                margin: [0, 4],
                style: { bold: true },
              },
              {
                text: 'Barber Name',
                border: [false, true, false, true],
                margin: [0, 4],
                style: { bold: true },
              },
              {
                text: 'Service',
                border: [false, true, false, true],
                style: { bold: true },
                margin: [0, 4],
              },
              {
                text: 'Total',
                border: [false, true, false, true],
                margin: [0, 4],
                style: { bold: true },
              },
            ],
            ...salesList,
          ],
        },
      },
      {
        fontSize: 11,
        table: {
          widths: ['80%', '20%'],
          body: [
            [
              {
                text: 'Total:',
                alignment: 'right',
                style: {
                  fontSize: 11,
                  bold: true,
                },
                border: [false, false, false, false],
                margin: [0, 5, 0, 5],
              },
              {
                text: formatCurrency(total),
                alignment: 'right',
                style: {
                  fontSize: 11,
                  bold: true,
                },
                border: [false, false, false, true],
                margin: [0, 5, 0, 5],
              },
            ],
          ],
        },
      },

      {
        text: 'Staff Sales Statistics',
        pageBreak: 'before',
        style: {
          fontSize: 12,
          bold: true,
        },
        margin: [0, 30, 0, 10],
      },
      {
        fontSize: 11,
        table: {
          widths: ['30%', '45%', '25%'],
          body: [
            [
              {
                text: 'Name',
                border: [false, true, false, true],
                margin: [0, 4],
                style: { bold: true },
              },
              {
                text: 'Branch',
                border: [false, true, false, true],
                margin: [0, 4],
                style: { bold: true },
              },
              {
                text: 'Total Sale',
                border: [false, true, false, true],
                margin: [0, 4],
                style: { bold: true },
              },
            ],
            ...salesStatsList,
          ],
        },
      },
    ],
  };
  var options = {};

  // create invoice and save it to invoices_pdf folder
  const pdfDoc = printer.createPdfKitDocument(docDefinition, options);

  pdfDoc.end();
  pdfDoc.pipe(res);
};

const generateHeader = (doc, invoice) => {
  if (invoice?.by_branch) {
    doc
      .image('./src/assets/logo.png', 50, 45, { width: 30 })
      .fillColor('#444444')
      .fontSize(16)
      .text(invoice.company.name, 90, 50)
      .fontSize(10)
      .text(invoice.company.name, 200, 50, { align: 'right' })
      .text(invoice.company.address, 200, 65, { align: 'right' })
      .text(
        `${invoice.company.city}, ${invoice.company.postcode}, ${invoice.company.state}`,
        200,
        80,
        { align: 'right' }
      )
      .moveDown();
  } else {
    doc
      .image('./src/assets/logo.png', 50, 45, { width: 30 })
      .fillColor('#444444')
      .fontSize(16)
      .text('Rolex Barbershop', 90, 50)
      .fontSize(10)
      // .text(invoice.company.name, 200, 50, { align: 'right' })
      // .text(invoice.company.address, 200, 65, { align: 'right' })
      // .text(
      //   `${invoice.company.city}, ${invoice.company.postcode}, ${invoice.company.state}`,
      //   200,
      //   80,
      //   { align: 'right' }
      // )
      .moveDown();
  }
};

const generateFooter = (doc) => {
  doc
    .fontSize(10)
    .text('This is a generated statement, no singature required.', 50, 780, {
      align: 'center',
      width: 500,
    });
};

const generateStatementTitle = (doc, invoice) => {
  doc
    .font('Helvetica-Bold')
    .fontSize(16)
    .text(
      `${
        invoice.type === 'annual' ? 'Annual Statement' : 'Monthly Statement'
      }`.toUpperCase(),
      50,
      120,
      {
        align: 'center',
        width: 500,
      }
    )
    .font('Helvetica')
    .fontSize(14)
    .text(
      `${
        invoice.type === 'annual'
          ? moment(invoice.date).year()
          : moment(invoice.date).format('MMMM YYYY')
      }`,
      50,
      140,
      {
        align: 'center',
        width: 500,
      }
    );
};

const generateSalesTableRow = (
  doc,
  y,
  date,
  customerName,
  branch,
  barber,
  service,
  total
) => {
  doc
    .fontSize(10)
    .text(date, 50, y)
    .text(customerName, 120, y, { width: 80, align: 'left' })
    .text(branch, 210, y, { width: 70, align: 'left' })
    .text(barber, 270, y, { width: 80, align: 'left' })
    .text(service, 350, y, { width: 150, align: 'left' })
    .text(total, 0, y, { align: 'right' })
    .moveDown();
};

const generateHr = (doc, y) => {
  doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
};

const formatCurrency = (cents) => {
  return 'RM ' + parseFloat(cents).toFixed(2);
};

const formatDate = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return day + '/' + month + '/' + year;
};

function generateSalesTable(doc, invoice) {
  let i;
  const invoiceTableTop = 200;

  doc
    .font('Helvetica-Bold')
    .fillColor('#444444')
    .fontSize(14)
    .text('Sales History', 50, invoiceTableTop - 30);

  doc.font('Helvetica-Bold');
  generateSalesTableRow(
    doc,
    invoiceTableTop,
    'Date',
    'Customer Name',
    'Branch',
    'Barber',
    'Service',
    'Total'
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font('Helvetica');

  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    const service = invoice.items[i].service;
    const spacingMultiplier = service.length * 5;
    console.log('spacingMUl', spacingMultiplier);

    let serviceItem = '';

    invoice.items[i].service.map((item, index) => {
      if (index > 0) serviceItem += '\n';
      serviceItem += `${item.quantity} x ${item.name} (${formatCurrency(
        item.price
      )})`;
    });

    const position = invoiceTableTop + (i + 1) * 32;
    generateSalesTableRow(
      doc,
      position,
      item.date,
      item.name,
      item.branch,
      item.barber,
      serviceItem,
      formatCurrency(item.total)
    );

    // generateHr(doc, position + spacingMultiplier + 20);
  }

  const table0 = {
    headers: ['Word', 'Comment', 'Summary'],
    rows: [
      [
        'Apple',
        'Not this one',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla viverra at ligula gravida ultrices. Fusce vitae pulvinar magna.',
      ],
      [
        'Tire',
        'Smells like funny',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla viverra at ligula gravida ultrices. Fusce vitae pulvinar magna.',
      ],
    ],
  };

  doc.table(table0, {
    prepareHeader: () => doc.font('Helvetica-Bold'),
    prepareRow: (row, i) => doc.font('Helvetica').fontSize(12),
  });

  const table1 = {
    headers: ['Country', 'Conversion rate', 'Trend'],
    rows: [
      ['Switzerland', '12%', '+1.12%'],
      ['France', '67%', '-0.98%'],
      ['England', '33%', '+4.44%'],
    ],
  };

  doc.moveDown().table(table1, 100, 350, { width: 300 });
}

module.exports = {
  createInvoice,
};