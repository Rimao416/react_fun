import React from 'react'

const Other = () => {
    return (
        <div>
                  <section className="container">
        {users.map((u, i) => (
          <div className="slide">
            <div className="bar">
              <span className="icons">
                <FaAngleLeft />
              </span>
            </div>
            <div className="slide_img">
              {u.photo.map((p) => (
                <div className="images">
                  <img src={p} alt="" />
                </div>
              ))}
              {/* <img src={u.photo[0]} alt="" /> */}
            </div>
            <div className="slide_text" onClick={() => handleClick(users.id)}>
              {u.description}
            </div>
          </div>
        ))}
      </section>
      <section className="divider">
        <div className="grand-journal">
          <div className="divider_images">
            {/* <img src={handleClick(0)} alt="" /> */}
          </div>
        </div>
      </section>
        </div>
    )
}

export default Other