### 剑指 Offer 60. n 个骰子的点数

[剑指 Offer 60. n个骰子的点数 — Medium](https://leetcode-cn.com/problems/nge-tou-zi-de-dian-shu-lcof/)

【题目描述】把n个骰子扔在地上，所有骰子朝上一面的点数之和为s。输入n，打印出s的所有可能的值出现的概率。

 你需要用一个浮点数数组返回答案，其中第 i 个元素代表这 n 个骰子所能掷出的点数集合中第 i 小的那个的概率。

示例 1:

```
输入: 1
输出: [0.16667,0.16667,0.16667,0.16667,0.16667,0.16667]
```


示例 2:

```
输入: 2
输出: [0.02778,0.05556,0.08333,0.11111,0.13889,0.16667,0.13889,0.11111,0.08333,0.05556,0.02778]
```

【解题思路】动态规划

- 辅助数组：`dp[i][j]` 表示把 i 个骰子扔在地上, 所有骰子朝上一面的点数之和为 j 的次数
- 状态转移方程：如果把 i 个骰子扔在地上, 所有骰子朝上一面的点数之和为 j。相当于当前骰子朝上一面的点数为 cur（cur 可以是从 1 到 6）, 前面 i-1 个骰子的点数之和为 j-cur。即 `dp[i][j] += dp[i-1][j-cur];`

```java
class Solution {
    public double[] dicesProbability(int n) {

        // dp[i][j] 表示把 i 个骰子扔在地上, 所有骰子朝上一面的点数之和为 j 的次数
        int[][] dp = new int[n+1][n*6 + 1];

        // base case: 只有一个骰子
        for (int i = 1; i <= 6; i ++) {
            dp[1][i] = 1;
        }

        for (int i = 2; i <= n; i ++) { // 骰子的个数
            for (int j = i; j <= i*6; j ++) { // 总共 i 个骰子朝上一面的点数之和
                for (int cur = 1; cur <= 6; cur ++) { // 当前骰子朝上一面的点数
                    if (cur >= j) {
                        // 当前骰子朝上一面的点数大于等于所有骰子朝上一面的点数之和，直接 break
                        break;
                    }
                    // 总共 i 个骰子朝上一面的点数之和为 j，
                    // 相当于当前骰子朝上一面的点数为 cur, 前面 i-1 个骰子的点数之和为 j-cur
                    dp[i][j] += dp[i-1][j-cur];
                }
            }
        }


        // 在 dp 中查找总共 n 个骰子朝上一面的点数之和为 j 的次数
        double[] res = new double[n*5+1];
        int index = 0;
        double all = Math.pow(6, n); // 总共有 6^n 种点数和
        for (int j = n; j <= n*6; j ++) {
            res[index ++] = dp[n][j]*1.0 / all;
        }

        return res;
    }
}
```

