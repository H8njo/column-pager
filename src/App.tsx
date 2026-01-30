import { ColumnPager } from './components';
import Footer from './components/@common/Footer';
import Header from './components/@common/Header';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <ColumnPager
        columnCount={2}
        pageDirection="vertical"
        loading={false}
        hidden={false}
        columnClassName={''}
        showDividers={false}
        onPagesGenerated={(pages, htmlString) => {
          console.log('pagesGenerated', pages, htmlString);
        }}
        header={() => <Header name="Test" />}
        footer={({ pageNumber, pageInformation }) => (
          <Footer pageNumber={pageNumber} contentsName={pageInformation ?? ''} />
        )}
      >
        <h1 className="text-2xl font-bold mb-4">Column Pager 소개</h1>
        <p className="mb-3">
          Column Pager는 React 기반의 자동 페이지 분할 컴포넌트입니다. 긴 콘텐츠를 여러 페이지와
          컬럼으로 자동 분할하여 인쇄나 PDF 생성에 최적화된 레이아웃을 제공합니다.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">주요 기능</h2>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>자동 페이지 분할: 콘텐츠 높이에 따라 자동으로 페이지를 나눕니다.</li>
          <li>다중 컬럼 지원: 1개 이상의 컬럼 레이아웃을 지원합니다.</li>
          <li>헤더/푸터: 각 페이지에 커스텀 헤더와 푸터를 추가할 수 있습니다.</li>
          <li>HTML 출력: 생성된 페이지를 HTML 문자열로 추출할 수 있습니다.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-3">사용 예시</h2>
        <p className="mb-3">
          ColumnPager는 보고서, 문서, 인보이스 등 인쇄가 필요한 다양한 콘텐츠에 활용할 수 있습니다.
          각 페이지는 A4 크기에 맞게 최적화되어 있으며, 페이지 번호와 섹션 정보를 헤더/푸터에 표시할
          수 있습니다.
        </p>

        <h1 className="text-2xl font-bold mb-4">Column Pager 소개</h1>
        <p className="mb-3">
          Column Pager는 React 기반의 자동 페이지 분할 컴포넌트입니다. 긴 콘텐츠를 여러 페이지와
          컬럼으로 자동 분할하여 인쇄나 PDF 생성에 최적화된 레이아웃을 제공합니다.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">주요 기능</h2>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>자동 페이지 분할: 콘텐츠 높이에 따라 자동으로 페이지를 나눕니다.</li>
          <li>다중 컬럼 지원: 1개 이상의 컬럼 레이아웃을 지원합니다.</li>
          <li>헤더/푸터: 각 페이지에 커스텀 헤더와 푸터를 추가할 수 있습니다.</li>
          <li>HTML 출력: 생성된 페이지를 HTML 문자열로 추출할 수 있습니다.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-3">사용 예시</h2>
        <p className="mb-3">
          ColumnPager는 보고서, 문서, 인보이스 등 인쇄가 필요한 다양한 콘텐츠에 활용할 수 있습니다.
          각 페이지는 A4 크기에 맞게 최적화되어 있으며, 페이지 번호와 섹션 정보를 헤더/푸터에 표시할
          수 있습니다.
        </p>

        <h1 className="text-2xl font-bold mb-4">Column Pager 소개</h1>
        <p className="mb-3">
          Column Pager는 React 기반의 자동 페이지 분할 컴포넌트입니다. 긴 콘텐츠를 여러 페이지와
          컬럼으로 자동 분할하여 인쇄나 PDF 생성에 최적화된 레이아웃을 제공합니다.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">주요 기능</h2>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>자동 페이지 분할: 콘텐츠 높이에 따라 자동으로 페이지를 나눕니다.</li>
          <li>다중 컬럼 지원: 1개 이상의 컬럼 레이아웃을 지원합니다.</li>
          <li>헤더/푸터: 각 페이지에 커스텀 헤더와 푸터를 추가할 수 있습니다.</li>
          <li>HTML 출력: 생성된 페이지를 HTML 문자열로 추출할 수 있습니다.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-3">사용 예시</h2>
        <p className="mb-3">
          ColumnPager는 보고서, 문서, 인보이스 등 인쇄가 필요한 다양한 콘텐츠에 활용할 수 있습니다.
          각 페이지는 A4 크기에 맞게 최적화되어 있으며, 페이지 번호와 섹션 정보를 헤더/푸터에 표시할
          수 있습니다.
        </p>

        <h1 className="text-2xl font-bold mb-4">Column Pager 소개</h1>
        <p className="mb-3">
          Column Pager는 React 기반의 자동 페이지 분할 컴포넌트입니다. 긴 콘텐츠를 여러 페이지와
          컬럼으로 자동 분할하여 인쇄나 PDF 생성에 최적화된 레이아웃을 제공합니다.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">주요 기능</h2>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>자동 페이지 분할: 콘텐츠 높이에 따라 자동으로 페이지를 나눕니다.</li>
          <li>다중 컬럼 지원: 1개 이상의 컬럼 레이아웃을 지원합니다.</li>
          <li>헤더/푸터: 각 페이지에 커스텀 헤더와 푸터를 추가할 수 있습니다.</li>
          <li>HTML 출력: 생성된 페이지를 HTML 문자열로 추출할 수 있습니다.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-3">사용 예시</h2>
        <p className="mb-3">
          ColumnPager는 보고서, 문서, 인보이스 등 인쇄가 필요한 다양한 콘텐츠에 활용할 수 있습니다.
          각 페이지는 A4 크기에 맞게 최적화되어 있으며, 페이지 번호와 섹션 정보를 헤더/푸터에 표시할
          수 있습니다.
        </p>

        <h1 className="text-2xl font-bold mb-4">Column Pager 소개</h1>
        <p className="mb-3">
          Column Pager는 React 기반의 자동 페이지 분할 컴포넌트입니다. 긴 콘텐츠를 여러 페이지와
          컬럼으로 자동 분할하여 인쇄나 PDF 생성에 최적화된 레이아웃을 제공합니다.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">주요 기능</h2>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>자동 페이지 분할: 콘텐츠 높이에 따라 자동으로 페이지를 나눕니다.</li>
          <li>다중 컬럼 지원: 1개 이상의 컬럼 레이아웃을 지원합니다.</li>
          <li>헤더/푸터: 각 페이지에 커스텀 헤더와 푸터를 추가할 수 있습니다.</li>
          <li>HTML 출력: 생성된 페이지를 HTML 문자열로 추출할 수 있습니다.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-3">사용 예시</h2>
        <p className="mb-3">
          ColumnPager는 보고서, 문서, 인보이스 등 인쇄가 필요한 다양한 콘텐츠에 활용할 수 있습니다.
          각 페이지는 A4 크기에 맞게 최적화되어 있으며, 페이지 번호와 섹션 정보를 헤더/푸터에 표시할
          수 있습니다.
        </p>

        <h1 className="text-2xl font-bold mb-4">Column Pager 소개</h1>
        <p className="mb-3">
          Column Pager는 React 기반의 자동 페이지 분할 컴포넌트입니다. 긴 콘텐츠를 여러 페이지와
          컬럼으로 자동 분할하여 인쇄나 PDF 생성에 최적화된 레이아웃을 제공합니다.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">주요 기능</h2>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>자동 페이지 분할: 콘텐츠 높이에 따라 자동으로 페이지를 나눕니다.</li>
          <li>다중 컬럼 지원: 1개 이상의 컬럼 레이아웃을 지원합니다.</li>
          <li>헤더/푸터: 각 페이지에 커스텀 헤더와 푸터를 추가할 수 있습니다.</li>
          <li>HTML 출력: 생성된 페이지를 HTML 문자열로 추출할 수 있습니다.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-3">사용 예시</h2>
        <p className="mb-3">
          ColumnPager는 보고서, 문서, 인보이스 등 인쇄가 필요한 다양한 콘텐츠에 활용할 수 있습니다.
          각 페이지는 A4 크기에 맞게 최적화되어 있으며, 페이지 번호와 섹션 정보를 헤더/푸터에 표시할
          수 있습니다.
        </p>
      </ColumnPager>
    </div>
  );
}

export default App;
