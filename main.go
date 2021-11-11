package main

import (
	"crypto/sha512"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
)

func hash(text string) string {
	s := text
	h1 := sha512.Sum512([]byte(s)) // 문자열의 SHA512 해시 값 추출
	//fmt.Printf("%x\n", h1)

	//sha := sha512.New()          // SHA512 해시 인스턴스 생성
	//sha.Write([]byte("Hello, ")) // 해시 인스턴스에 데이터 추가
	//sha.Write([]byte("world!"))  // 해시 인스턴스에 데이터 추가
	//h2 := sha.Sum(nil)           // 해시 인스턴스에 저장된 데이터의 SHA512 해시 값 추출
	//fmt.Printf("%x\n", h2)
	return fmt.Sprintf("%x", h1)
}

func init() {

}

func main() {
	r := gin.Default()
	r.Static("/assets", "./assets")
	r.GET("/", func(context *gin.Context) {
		r.LoadHTMLGlob("templates/*")
		context.HTML(http.StatusOK, "index.html", gin.H{
			"message": "ok",
		})

	})
	r.POST("/fpga", func(context *gin.Context) {
		fpganum := context.Query("fpganum")
		text := context.Query("text")
		result := hash(text)
		context.JSON(200, gin.H{
			"message": "ok",
			"fpganum": fpganum,
			"result": result,
		})
	})
	r.POST("/fpga_form", func(context *gin.Context) {
		fpganum := context.PostForm("fpganum")
		text := context.PostForm("encryptText")
		result := hash(text)
		context.JSON(200, gin.H{
			"text": text,
			"message": "ok",
			"fpganum": fpganum,
			"result": result,
		})
	})
	err := r.Run()
	if err != nil {
		return
	}
}
