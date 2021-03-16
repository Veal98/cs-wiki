## 剑指 Offer 58 - II. 左旋转字符串

[剑指 Offer 58 - II. 左旋转字符串](https://leetcode-cn.com/problems/zuo-xuan-zhuan-zi-fu-chuan-lcof/)

【题目描述】字符串的左旋转操作是把字符串前面的若干个字符转移到字符串的尾部。请定义一个函数实现字符串左旋转操作的功能。比如，输入字符串"abcdefg"和数字2，该函数将返回左旋转两位得到的结果"cdefgab"。

示例 1：

```
输入: s = "abcdefg", k = 2
输出: "cdefgab"
```


示例 2：

```
输入: s = "lrloseumgh", k = 6
输出: "umghlrlose"
```

【解题思路】最简单的，不用多说，将 k 后面的字符串放到前面来，将 k 前面的字符串放到后面来就行了

```java
class Solution {
    public String reverseLeftWords(String s, int k) {
        StringBuilder res = new StringBuilder();
        
        for (int i = k; i < s.length(); i ++) {
            res.append(s.charAt(i));
        }
        
        for (int i = 0; i < k; i ++) {
            res.append(s.charAt(i));
        }
        
        return res.toString();
    }
}
```

还有一种，三次反转。举个例子大家就懂了。例如：输入: s = "abcdefg", k = 2

- "abcdefg" 反转前2个字符 "bacdefg"
- "bacdefg" 反转后5个字符 "bagfedc"
- "bagfedc" 反转整个字符串 "cdefgab"

```java
class Solution {
    public String reverseLeftWords(String s, int k) {
        char[] arr = s.toCharArray();
        // 反转前 k 位
        reverse(arr, 0, k-1);
        // 反转 k 后面的字符串
        reverse(arr, k, arr.length - 1);
        // 整体反转
        reverse(arr, 0, arr.length - 1);
            
        return new String(arr);
    }
    
    private void reverse(char[] arr, int left, int right) {
        // 字符串反转
        while (left < right) {
            char temp = arr[left];
            arr[left] = arr[right];
            arr[right] = temp;
            left ++;
            right --;
        }
    }
}
```