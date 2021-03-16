### 剑指 Offer 54. 二叉搜索树的第 k 大节点

👉 [剑指 Offer 54. 二叉搜索树的第 k 大节点 — Easy](https://leetcode-cn.com/problems/er-cha-sou-suo-shu-de-di-kda-jie-dian-lcof/)

【题目描述】给定一棵二叉搜索树，请找出其中第k大的节点。

示例 1:

```
输入: root = [3,1,4,null,2], k = 1
   3
  / \
 1   4
  \
   2
输出: 4
```


示例 2:

```
输入: root = [5,3,6,2,4,null,null,1], k = 3
       5
      / \
     3   6
    / \
   2   4
  /
 1
输出: 4
```

【解题思路】中序遍历（左根右）的结果就是升序排序，那么逆中序遍历（右左根）的结果就是降序排序，第 k 大的元素就是逆中序遍历结果的第 k 个数。

```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
class Solution {
    public int kthLargest(TreeNode root, int k) {
        List<TreeNode> res = new ArrayList<>();
        inorderTree(root, k, res);
        return res.get(res.size()-1).val;
    }
    
    // 逆中序遍历
    private void inorderTree(TreeNode root, int k, List<TreeNode> res) {
        if (root == null) {
            return ;
        }
        
        inorderTree(root.right, k, res);
        
        if (res.size() != k) {
            res.add(root);
        }
        
        inorderTree(root.left, k, res);
    }
}
```