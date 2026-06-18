import { useState } from "react";
import "./App.css";

function App() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "React 게시판 프로젝트 시작하기",
      writer: "관리자",
      content:
        "React 상태 관리를 활용하여 게시글 등록, 조회, 수정, 삭제 기능을 만들어 봅니다.",
      createdAt: "2026-06-11",
    },
    {
      id: 2,
      title: "CRUD 기능 이해하기",
      writer: "강사",
      content:
        "CRUD는 Create, Read, Update, Delete의 약자로 대부분의 웹 서비스에서 사용하는 기본 기능입니다.",
      createdAt: "2026-06-11",
    },
  ]);

  const [title, setTitle] = useState("");
  const [writer, setWriter] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);

  const getToday = () => new Date().toISOString().slice(0, 10);

  const resetForm = () => {
    setTitle("");
    setWriter("");
    setContent("");
    setEditId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !writer.trim() || !content.trim()) {
      alert("제목, 작성자, 내용을 모두 입력해주세요.");
      return;
    }

    if (editId) {
      const updatedPosts = posts.map((post) =>
        post.id === editId
          ? {
              ...post,
              title,
              writer,
              content,
            }
          : post
      );

      setPosts(updatedPosts);

      if (selectedPost && selectedPost.id === editId) {
        setSelectedPost({
          ...selectedPost,
          title,
          writer,
          content,
        });
      }

      resetForm();
      return;
    }

    const newPost = {
      id: Date.now(),
      title,
      writer,
      content,
      createdAt: getToday(),
    };

    setPosts([newPost, ...posts]);
    setSelectedPost(newPost);
    resetForm();
  };

  const handleSelectPost = (post) => {
    setSelectedPost(post);
  };

  const handleEdit = (post) => {
    setEditId(post.id);
    setTitle(post.title);
    setWriter(post.writer);
    setContent(post.content);
  };

  const handleDelete = (id) => {
    const isConfirm = window.confirm("정말 이 게시글을 삭제하시겠습니까?");

    if (!isConfirm) return;

    const filteredPosts = posts.filter((post) => post.id !== id);

    setPosts(filteredPosts);

    if (selectedPost && selectedPost.id === id) {
      setSelectedPost(null);
    }

    if (editId === id) {
      resetForm();
    }
  };

  const filteredPosts = posts.filter((post) => {
    const keyword = searchText.toLowerCase();

    return (
      post.title.toLowerCase().includes(keyword) ||
      post.writer.toLowerCase().includes(keyword) ||
      post.content.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="app">
      <div className="board-container">
        <header className="board-header">
          <h1>게시판 CRUD 앱</h1>
          <p>
            게시글 등록, 목록 조회, 상세 보기, 수정, 삭제, 검색 기능을
            연습합니다.
          </p>
        </header>

        <section className="summary-area">
          <div className="summary-card">
            <span>전체 게시글</span>
            <strong>{posts.length}</strong>
          </div>

          <div className="summary-card">
            <span>검색 결과</span>
            <strong>{filteredPosts.length}</strong>
          </div>

          <div className="summary-card">
            <span>현재 모드</span>
            <strong>{editId ? "수정" : "등록"}</strong>
          </div>
        </section>

        <main className="board-layout">
          <section className="form-panel">
            <h2>{editId ? "게시글 수정" : "게시글 등록"}</h2>

            <form onSubmit={handleSubmit} className="post-form">
              <label>
                <span>제목</span>
                <input
                  type="text"
                  placeholder="게시글 제목을 입력하세요"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </label>

              <label>
                <span>작성자</span>
                <input
                  type="text"
                  placeholder="작성자 이름을 입력하세요"
                  value={writer}
                  onChange={(e) => setWriter(e.target.value)}
                />
              </label>

              <label>
                <span>내용</span>
                <textarea
                  placeholder="게시글 내용을 입력하세요"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </label>

              <div className="form-buttons">
                <button type="submit" className="primary-button">
                  {editId ? "수정 완료" : "게시글 등록"}
                </button>

                {editId && (
                  <button
                    type="button"
                    className="gray-button"
                    onClick={resetForm}
                  >
                    수정 취소
                  </button>
                )}
              </div>
            </form>
          </section>

          <section className="content-panel">
            <div className="search-box">
              <input
                type="text"
                placeholder="제목, 작성자, 내용으로 검색하세요"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            <div className="post-grid">
              <div className="post-list">
                <h2>게시글 목록</h2>

                {filteredPosts.length === 0 && (
                  <p className="empty-message">검색 결과가 없습니다.</p>
                )}

                {filteredPosts.map((post) => (
                  <article
                    key={post.id}
                    className={`post-card ${
                      selectedPost && selectedPost.id === post.id
                        ? "active"
                        : ""
                    }`}
                    onClick={() => handleSelectPost(post)}
                  >
                    <h3>{post.title}</h3>

                    <div className="post-meta">
                      <span>{post.writer}</span>
                      <span>{post.createdAt}</span>
                    </div>

                    <p>{post.content}</p>

                    <div className="card-buttons">
                      <button
                        type="button"
                        className="edit-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(post);
                        }}
                      >
                        수정
                      </button>

                      <button
                        type="button"
                        className="delete-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(post.id);
                        }}
                      >
                        삭제
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <div className="detail-box">
                {selectedPost ? (
                  <>
                    <h2>게시글 상세 보기</h2>

                    <h3>{selectedPost.title}</h3>

                    <div className="detail-meta">
                      <span>작성자: {selectedPost.writer}</span>
                      <span>작성일: {selectedPost.createdAt}</span>
                    </div>

                    <p className="detail-content">
                      {selectedPost.content}
                    </p>

                    <div className="detail-buttons">
                      <button
                        type="button"
                        className="edit-button"
                        onClick={() => handleEdit(selectedPost)}
                      >
                        이 글 수정
                      </button>

                      <button
                        type="button"
                        className="delete-button"
                        onClick={() => handleDelete(selectedPost.id)}
                      >
                        이 글 삭제
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="empty-detail">
                    <h2>게시글을 선택하세요</h2>
                    <p>
                      목록에서 게시글을 클릭하면 상세 내용을 확인할 수 있습니다.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;